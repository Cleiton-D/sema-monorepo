package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;

import br.net.diarioescolar.dto.SchoolReportBySchoolTermDTO;
import br.net.diarioescolar.grpc.SchoolTermSchoolReports;

@Mapper
public interface SchoolReportBySchoolTermMapper {
  SchoolReportBySchoolTermDTO requestToDto(SchoolTermSchoolReports request);
}
