package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.net.diarioescolar.dto.MinifiedAttendanceDTO;
import br.net.diarioescolar.grpc.MinifiedAttendance;

@Mapper(uses = { GrpcDateMapper.class })
public interface MinifiedAttendanceMapper {

  @Mapping(source = "studentName", target = "student_name")
  @Mapping(source = "classDate", target = "class_date")
  MinifiedAttendanceDTO requestToDto(MinifiedAttendance request);
}
