package br.net.diarioescolar.dto;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateFinalResultDTO {
  private List<FinalResultDTO> finalResult;

  private Date schoolYearEndDate;
  private String schoolName;
  private String referenceYear;
  private String grade;
  private String classroom;
  private String classPeriod;
}
