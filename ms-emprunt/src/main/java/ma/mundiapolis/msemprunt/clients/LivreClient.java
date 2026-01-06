package ma.mundiapolis.msemprunt.clients;

import ma.mundiapolis.msemprunt.dto.LivreDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "ms-livre")
public interface LivreClient {

    @GetMapping("/api/livre/{id}")
    LivreDto getLivreById(@PathVariable Long id);

    @PutMapping("/api/livre/{id}/emprunter")
    LivreDto emprunterLivre(@PathVariable Long id);

    @PutMapping("/api/livre/{id}/retourner")
    LivreDto retournerLivre(@PathVariable Long id);
}