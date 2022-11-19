package br.net.diarioescolar;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import br.net.diarioescolar.dto.UserDTO;

@Path("/hello")
public class GreetingResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public UserDTO hello() {
        UserDTO user = new UserDTO("Cleiton", 23);
        return user;
    }
}