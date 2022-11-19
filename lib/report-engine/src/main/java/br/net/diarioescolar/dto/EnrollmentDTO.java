package br.net.diarioescolar.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentDTO {
  private String student_name;
  private String enroll_date;
  private String gender;
  private String origin;
  private String breed;
  private String birth_date;
  private String age;
  private String transfer_date;
}
