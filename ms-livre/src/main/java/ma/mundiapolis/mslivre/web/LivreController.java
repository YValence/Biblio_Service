package ma.mundiapolis.mslivre.web;

import lombok.RequiredArgsConstructor;
import ma.mundiapolis.mslivre.dto.LivreReqDto;
import ma.mundiapolis.mslivre.dto.LivreRespDto;
import ma.mundiapolis.mslivre.mappers.LivreMapper;
import ma.mundiapolis.mslivre.services.LivreService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/livre")
@RequiredArgsConstructor
public class LivreController {

    final LivreService livreService;
    final LivreMapper livreMapper;

    @GetMapping("/{id}")
    public LivreRespDto findById(@PathVariable Long id) {
        return livreService.getBookById(id);
    }

    @GetMapping
    public java.util.List<LivreRespDto> getAll() {
        return livreService.getAllBooks();
    }

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public LivreRespDto add(@RequestBody LivreReqDto livre) {
        return livreService.addBook(livre);
    }

    @PutMapping("/{id}")
    public LivreRespDto update(@PathVariable Long id, @RequestBody LivreReqDto livre) {
        return livreService.updateBook(id, livre);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        livreService.deleteBook(id);
    }

    // ✅ NOUVEAUX ENDPOINTS POUR EMPRUNTS
    @PutMapping("/{id}/emprunter")
    public LivreRespDto emprunter(@PathVariable Long id) {
        return livreService.emprunterLivre(id);
    }

    @PutMapping("/{id}/retourner")
    public LivreRespDto retourner(@PathVariable Long id) {
        return livreService.retournerLivre(id);
    }
}