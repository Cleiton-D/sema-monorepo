package br.net.diarioescolar.service;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import br.net.diarioescolar.builder.AttendancesBuilder;
import br.net.diarioescolar.builder.ClassesBuilder;
import br.net.diarioescolar.builder.CoverBuilder;
import br.net.diarioescolar.builder.FinalResultBuilder;
import br.net.diarioescolar.builder.NominalRelationBuilder;
import br.net.diarioescolar.builder.SchoolSubjectResumeBuilder;
import br.net.diarioescolar.dto.BySchoolTermDTO;
import br.net.diarioescolar.dto.ClassDTO;
import br.net.diarioescolar.dto.EnrollmentDTO;
import br.net.diarioescolar.dto.FinalResultDTO;
import br.net.diarioescolar.dto.GenerateClassDiaryDTO;
import br.net.diarioescolar.dto.SchoolSubjectClassDiaryDTO;
import br.net.diarioescolar.dto.MinifiedAttendanceDTO;
import br.net.diarioescolar.dto.SchoolReportBySchoolTermDTO;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;

public class ClassDiaryService {

  public ByteArrayOutputStream generate(GenerateClassDiaryDTO data) throws JRException {
    List<List<JasperPrint>> reports = data.getItems().stream()
      .map(item -> this.generatePages(data, item))
      .filter(item -> item != null)
      .collect(Collectors.toList());

      List<JasperPrint> pages = reports.stream().flatMap(List::stream).collect(Collectors.toList());


    try {
      JasperPrint finalReport = new FinalResultBuilder<FinalResultDTO>()
        .setList(data.getFinalResult())
        .setParam("school_name", data.getSchoolName())
        .setParam("reference_year", data.getReferenceYear())
        .setParam("current_date", new Date())
        .setParam("grade", data.getGrade())
        .setParam("classroom", data.getClassroom())
        .setParam("class_period", data.getClassPeriod())
        .build();

      pages.add(finalReport);
    } catch (JRException e) {
      e.printStackTrace();
    }

    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();


    JRPdfExporter exporter = new JRPdfExporter();
    exporter.setExporterInput(SimpleExporterInput.getInstance(pages));
    exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(byteArrayOutputStream));

    exporter.exportReport();

    return byteArrayOutputStream;
  }


  private List<JasperPrint> generatePages(GenerateClassDiaryDTO data, SchoolSubjectClassDiaryDTO schoolSubjectClassDiary) {
    List<JasperPrint> pageList = new ArrayList<JasperPrint>();
    try {
      JasperPrint cover = CoverBuilder
        .newBuilder()
        .setParam("school_name", data.getSchoolName())
        .setParam("school_subject", schoolSubjectClassDiary.getSchoolSubject())
        .setParam("grade", data.getGrade())
        .setParam("classroom", data.getClassroom())
        .setParam("class_period", data.getClassPeriod())
        .setParam("reference_year", data.getReferenceYear())
        .setParam("teacher", schoolSubjectClassDiary.getTeacher())
        .build();

      JasperPrint nominalRelation = new NominalRelationBuilder<EnrollmentDTO>()
        .setList(data.getEnrolls())
        .setParam("school_name", data.getSchoolName())
        .setParam("class_period", data.getClassPeriod())
        .setParam("classroom", data.getClassroom())
        .build();

      List<JasperPrint> bySchoolTermPages = schoolSubjectClassDiary
        .getBySchoolTermItems()
        .stream()
        .map(bySchoolTermItem -> this.generateBySchoolTerm(data, schoolSubjectClassDiary, bySchoolTermItem))
        .flatMap(List::stream)
        .collect(Collectors.toList());

      pageList.add(cover);
      pageList.add(nominalRelation);
      pageList.addAll(bySchoolTermPages);

      return pageList;
    } catch (JRException e) {
      e.printStackTrace();
      return pageList;
    }
  }

  private List<JasperPrint> generateBySchoolTerm(GenerateClassDiaryDTO data, SchoolSubjectClassDiaryDTO schoolSubjectClassDiary, BySchoolTermDTO item) {
    List<JasperPrint> pageList = new ArrayList<JasperPrint>();
    try {
      JasperPrint attendances = new AttendancesBuilder<MinifiedAttendanceDTO>()
        .setList(item.getAttendances())
        .setParam("school_name", data.getSchoolName())
        .setParam("school_subject", schoolSubjectClassDiary.getSchoolSubject())
        .setParam("school_term", item.getSchoolTerm())
        .setParam("classroom", data.getClassroom())
        .setParam("class_period", data.getClassPeriod())
        .setParam("reference_year", data.getReferenceYear())
        .build();

      JasperPrint classes = new ClassesBuilder<ClassDTO>()
        .setList(item.getClasses())
        .setParam("school_name", data.getSchoolName())
        .setParam("school_subject", schoolSubjectClassDiary.getSchoolSubject())
        .setParam("classroom", data.getClassroom())
        .setParam("class_period", data.getClassPeriod())
        .setParam("reference_year", data.getReferenceYear())
        .setParam("school_term", item.getSchoolTerm())
        .setParam("workload", schoolSubjectClassDiary.getWorkload() / 4)
        .setParam("date_end", item.getSchoolTermEnd())
        .setParam("classes_taught", item.getClasses().size())
        .build();

      JasperPrint schoolReportsResume = new SchoolSubjectResumeBuilder<SchoolReportBySchoolTermDTO>()
        .setList(item.getSchoolReports())
        .setParam("school_name", data.getSchoolName())
        .setParam("school_subject", schoolSubjectClassDiary.getSchoolSubject())
        .setParam("school_term", item.getSchoolTerm())
        .setParam("classroom", data.getClassroom())
        .setParam("class_period", data.getClassPeriod())
        .setParam("reference_year", data.getReferenceYear())
        .setParam("workload", schoolSubjectClassDiary.getWorkload() / 4)
        .setParam("current_date", new Date())
        .setParam("classes_taught", item.getClasses().size())
        .setParam("teacher_name", schoolSubjectClassDiary.getTeacher())
        .build();

      pageList.add(attendances);
      pageList.add(classes);
      pageList.add(schoolReportsResume);

      return pageList;
    } catch (JRException e) {
      e.printStackTrace();
      return pageList;
    }
  }
}