package br.net.diarioescolar.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
  public String name;
  public Integer idade;

  public UserDTO(String name, Integer idade) {
    this.name = name;
    this.idade = idade;
  }

}
