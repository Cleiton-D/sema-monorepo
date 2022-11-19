package br.net.diarioescolar.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MinifiedAttendanceDTO {
  private String student_name;
  private Date class_date;
  private Boolean attendance;  
}
