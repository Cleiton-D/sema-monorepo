package br.net.diarioescolar.controller;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.factory.Mappers;

import com.google.protobuf.ByteString;

import br.net.diarioescolar.dto.BySchoolTermDTO;
import br.net.diarioescolar.dto.EnrollmentDTO;
import br.net.diarioescolar.dto.GenerateClassDiaryDTO;
import br.net.diarioescolar.dto.SchoolSubjectClassDiaryDTO;
import br.net.diarioescolar.dto.MinifiedAttendanceDTO;
import br.net.diarioescolar.grpc.ClassDiary;
import br.net.diarioescolar.grpc.ClassDiaryGenerateResponse;
import br.net.diarioescolar.grpc.MinifiedAttendance;
import br.net.diarioescolar.grpc.SchoolTermItems;
import br.net.diarioescolar.service.ClassDiaryService;
import br.net.diarioescolar.utils.mapper.ClassDiaryMapper;
import br.net.diarioescolar.grpc.ClassDiaryGenerateRequest;
import io.quarkus.grpc.GrpcService;
import io.smallrye.mutiny.Uni;
import net.sf.jasperreports.engine.JRException;

@GrpcService
public class ClassDiaryGrpcController implements ClassDiary {

  @Override
  public Uni<ClassDiaryGenerateResponse> generate(ClassDiaryGenerateRequest request) {
    // List<SchoolSubjectClassDiaryDTO> items = request.getItemsList().stream().map(item -> {
    //   SchoolSubjectClassDiaryDTO dto = new SchoolSubjectClassDiaryDTO();
    //   dto.setSchoolName(item.getSchoolName());
    //   dto.setSchoolSubject(item.getSchoolSubject());
    //   dto.setGrade(item.getGrade());
    //   dto.setClassroom(item.getClassroom());
    //   dto.setClassPeriod(item.getClassPeriod());
    //   dto.setReferenceYear(item.getReferenceYear());
    //   dto.setTeacher(item.getTeacher());
    //   dto.setBySchoolTermItems(this.getBySchoolTermItems(item.getBySchoolTermList()));

    //   return dto;
    // }).collect(Collectors.toList());

    // List<EnrollmentDTO> enrolls = request.getEnrollsList().stream().map(enroll -> {
    //   EnrollmentDTO dto = new EnrollmentDTO();
    //   dto.setStudent_name(enroll.getStudentName());
    //   dto.setEnroll_date(enroll.getEnrollDate());
    //   dto.setGender(enroll.getGender());
    //   dto.setOrigin(enroll.getOrigin());
    //   dto.setBreed(enroll.getBreed());
    //   dto.setBirth_date(enroll.getBirthDate());
    //   dto.setAge(enroll.getAge());
    //   dto.setTransfer_date(enroll.getTransferDate());

    //   return dto;
    // }).collect(Collectors.toList());


    // GenerateClassDiaryDTO generateClassDiaryDto = new GenerateClassDiaryDTO();
    // generateClassDiaryDto.setItems(items);
    // generateClassDiaryDto.setEnrolls(enrolls);

    ClassDiaryMapper mapper = Mappers.getMapper(ClassDiaryMapper.class);
    GenerateClassDiaryDTO generateClassDiaryDto = mapper.requestToDto(request);

    try {
      ClassDiaryService service = new ClassDiaryService();
      ByteArrayOutputStream output = service.generate(generateClassDiaryDto);

      return Uni.createFrom().item(() -> {
        return ClassDiaryGenerateResponse
          .newBuilder()
          .setFileChunk(ByteString.copyFrom(output.toByteArray()))
          .build();
      });
    } catch (JRException e) {
      return Uni.createFrom().item(() -> {
        return ClassDiaryGenerateResponse
          .newBuilder()
          .build();
      });
    }
  }

  private List<BySchoolTermDTO> getBySchoolTermItems(List<SchoolTermItems> items) {
    return items.stream().map(item -> {
      BySchoolTermDTO dto = new BySchoolTermDTO();
      dto.setSchoolTerm(item.getSchoolTerm());
      dto.setAttendances(this.getAttendances(item.getAttendancesList()));
      return dto;
    }).collect(Collectors.toList());
  }

  private List<MinifiedAttendanceDTO> getAttendances(List<MinifiedAttendance> attendances) {
    return attendances.stream().map(attendance -> {
      MinifiedAttendanceDTO dto = new MinifiedAttendanceDTO();
      dto.setStudent_name(attendance.getStudentName());

      LocalDate localClassDate = LocalDateTime.ofEpochSecond(
        attendance.getClassDate().getSeconds(), 
        attendance.getClassDate().getNanos(), 
        ZoneOffset.UTC
      ).toLocalDate();
      Date classDate = Date.from(localClassDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

      dto.setClass_date(classDate);
      dto.setAttendance(attendance.getAttendance());

      return dto;
    }).collect(Collectors.toList());
  }

}
