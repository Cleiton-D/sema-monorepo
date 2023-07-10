package br.net.diarioescolar.controller;

import java.io.ByteArrayOutputStream;

import org.mapstruct.factory.Mappers;

import com.google.protobuf.ByteString;

import br.net.diarioescolar.dto.GenerateClassDiaryDTO;
import br.net.diarioescolar.grpc.ClassDiary;
import br.net.diarioescolar.grpc.FileResponse;
import br.net.diarioescolar.service.ClassDiaryService;
import br.net.diarioescolar.utils.mapper.ClassDiaryMapper;
import br.net.diarioescolar.grpc.ClassDiaryGenerateRequest;
import io.quarkus.grpc.GrpcService;
import io.smallrye.mutiny.Uni;
import net.sf.jasperreports.engine.JRException;

@GrpcService
public class ClassDiaryGrpcController implements ClassDiary {

  @Override
  public Uni<FileResponse> generate(ClassDiaryGenerateRequest request) {
    ClassDiaryMapper mapper = Mappers.getMapper(ClassDiaryMapper.class);
    GenerateClassDiaryDTO generateClassDiaryDto = mapper.requestToDto(request);

    try {
      ClassDiaryService service = new ClassDiaryService();
      ByteArrayOutputStream output = service.generate(generateClassDiaryDto, "pdf");

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
          .build();
      });
    }
  }
}
