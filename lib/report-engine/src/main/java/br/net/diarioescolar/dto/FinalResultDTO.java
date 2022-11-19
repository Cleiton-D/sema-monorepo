package br.net.diarioescolar.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FinalResultDTO {
  private String studentName;
  private String schoolSubject;
  private Integer schoolSubjectOrder;
  private String finalResult;
  private BigDecimal average;
}
