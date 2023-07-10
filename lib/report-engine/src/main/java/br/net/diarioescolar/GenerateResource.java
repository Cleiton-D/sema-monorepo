package br.net.diarioescolar;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import br.net.diarioescolar.dto.GenerateClassDiaryDTO;
import br.net.diarioescolar.service.ClassDiaryService;
import io.smallrye.mutiny.Uni;
import net.sf.jasperreports.engine.JRException;

@Path("/generate")
public class GenerateResource {

    @POST
    @Path("/class-diary")
    public Uni<Response> generateClassDiary(GenerateClassDiaryDTO data) throws IOException {
        try {
            ClassDiaryService service = new ClassDiaryService();
            ByteArrayOutputStream output = service.generate(data);

            return Uni.createFrom().item(() -> Response.ok(output.toByteArray()).build());
        } catch (JRException e) {
            return Uni.createFrom().item(() -> Response.serverError().build());
        }
    }
}