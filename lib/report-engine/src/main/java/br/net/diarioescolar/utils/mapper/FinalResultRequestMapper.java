package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.net.diarioescolar.dto.GenerateFinalResultDTO;
import br.net.diarioescolar.grpc.FinalResultGenerateRequest;

@Mapper(uses = { 
  FinalResultMapper.class
})
public interface FinalResultRequestMapper {
  @Mapping(source = "finalResultList", target = "finalResult")
  GenerateFinalResultDTO requestToDto(FinalResultGenerateRequest request);
}
