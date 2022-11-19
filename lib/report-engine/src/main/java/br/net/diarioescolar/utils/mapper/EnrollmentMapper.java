package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.net.diarioescolar.dto.EnrollmentDTO;
import br.net.diarioescolar.grpc.Enrollment;

@Mapper
public interface EnrollmentMapper {

  @Mapping(source = "studentName", target = "student_name")
  @Mapping(source = "enrollDate", target = "enroll_date")
  @Mapping(source = "birthDate", target = "birth_date")
  @Mapping(source = "transferDate", target = "transfer_date")
  EnrollmentDTO requestToDto(Enrollment request);
}
