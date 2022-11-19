package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.net.diarioescolar.dto.ClassDTO;
import br.net.diarioescolar.grpc.Class;

@Mapper
public interface ClassMapper {
  @Mapping(source = "classDate", target = "class_date")
  @Mapping(source = "taughtContent", target = "taught_content")
  ClassDTO requestToDto(Class request);
}
