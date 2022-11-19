package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.net.diarioescolar.dto.GenerateClassDiaryDTO;
import br.net.diarioescolar.grpc.ClassDiaryGenerateRequest;

@Mapper(uses = { 
  EnrollmentMapper.class, 
  SchoolSubjectClassDiaryMapper.class,
  FinalResultMapper.class
})
public interface ClassDiaryMapper {
  @Mapping(source = "itemsList", target = "items")
  @Mapping(source = "enrollsList", target = "enrolls")
  @Mapping(source = "finalResultList", target = "finalResult")
  GenerateClassDiaryDTO requestToDto(ClassDiaryGenerateRequest request);
}
