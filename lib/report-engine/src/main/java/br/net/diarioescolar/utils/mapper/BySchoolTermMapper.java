package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.net.diarioescolar.dto.BySchoolTermDTO;
import br.net.diarioescolar.grpc.SchoolTermItems;

@Mapper(uses = { 
  MinifiedAttendanceMapper.class, 
  ClassMapper.class, 
  SchoolReportBySchoolTermMapper.class, 
  GrpcDateMapper.class 
})
public interface BySchoolTermMapper {

  @Mapping(source = "attendancesList", target = "attendances")
  @Mapping(source = "classesList", target = "classes")
  @Mapping(source = "schoolReportList", target = "schoolReports")
  BySchoolTermDTO requestToDto(SchoolTermItems request);
}
