package br.net.diarioescolar.dto;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BySchoolTermDTO {
  private String schoolTerm;
  private Date schoolTermEnd;
  private List<MinifiedAttendanceDTO> attendances;
  private List<ClassDTO> classes;
  private List<SchoolReportBySchoolTermDTO> schoolReports;
}
