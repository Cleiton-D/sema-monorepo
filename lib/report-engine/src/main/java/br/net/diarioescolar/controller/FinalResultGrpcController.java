package br.net.diarioescolar.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.mapstruct.factory.Mappers;

import com.google.protobuf.ByteString;

import br.net.diarioescolar.dto.GenerateFinalResultDTO;
import br.net.diarioescolar.grpc.FileResponse;
import br.net.diarioescolar.grpc.FinalResultGenerateRequest;
import br.net.diarioescolar.service.FinalResultService;
import br.net.diarioescolar.utils.mapper.FinalResultRequestMapper;
import io.quarkus.grpc.GrpcService;
import io.smallrye.mutiny.Uni;
import net.sf.jasperreports.engine.JRException;

@GrpcService
public class FinalResultGrpcController implements br.net.diarioescolar.grpc.FinalResultService {

  @Override
  public Uni<FileResponse> generate(FinalResultGenerateRequest request) {
    FinalResultRequestMapper mapper = Mappers.getMapper(FinalResultRequestMapper.class);
    GenerateFinalResultDTO generateFinalResultDto = mapper.requestToDto(request);

    try {
      FinalResultService service = new FinalResultService();
      ByteArrayOutputStream output = service.generate(generateFinalResultDto, "pdf");

      return Uni.createFrom().item(() -> {
        return FileResponse
          .newBuilder()
          .setFileChunk(ByteString.copyFrom(output.toByteArray()))
          .build();
      });
    } catch (JRException e) {
      return Uni.createFrom().item(() -> {
        return FileResponse
          .newBuilder()
          .build() ;
      });
    } catch (IOException e) {
      return Uni.createFrom().item(() -> {
        return FileResponse
          .newBuilder()
          .build() ;
      });
    }
  }
  
}
