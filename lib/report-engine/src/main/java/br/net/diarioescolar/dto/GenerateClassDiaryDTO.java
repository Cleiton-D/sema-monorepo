package br.net.diarioescolar.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateClassDiaryDTO {
  private List<SchoolSubjectClassDiaryDTO> items;
  private List<EnrollmentDTO> enrolls;
  private List<FinalResultDTO> finalResult;

  private String schoolYearEndDate;
  private String schoolName;
  private String referenceYear;
  private String grade;
  private String classroom;
  private String classPeriod;
}