package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.net.diarioescolar.dto.SchoolSubjectClassDiaryDTO;
import br.net.diarioescolar.grpc.SchoolSubjectClassDiary;

@Mapper(uses = { BySchoolTermMapper.class })
public interface SchoolSubjectClassDiaryMapper {

  @Mapping(source = "bySchoolTermList", target = "bySchoolTermItems")
  SchoolSubjectClassDiaryDTO requestToDto(SchoolSubjectClassDiary request);
}
