package br.net.diarioescolar.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchoolReportBySchoolTermDTO {
  private String schoolSubject;
  private String studentName;
  private BigDecimal average;
  private Integer absences;
  private Integer schoolSubjectOrder;
}
