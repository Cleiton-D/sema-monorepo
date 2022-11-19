package br.net.diarioescolar.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchoolSubjectClassDiaryDTO {
  private String schoolSubject;
  private String teacher;
  private Integer workload;

  private List<BySchoolTermDTO> bySchoolTermItems;
}
