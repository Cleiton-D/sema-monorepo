package br.net.diarioescolar.utils.mapper;

import org.mapstruct.Mapper;

import br.net.diarioescolar.dto.FinalResultDTO;
import br.net.diarioescolar.grpc.FinalResult;

@Mapper
public interface FinalResultMapper {
  FinalResultDTO requestToDto(FinalResult request);
}
