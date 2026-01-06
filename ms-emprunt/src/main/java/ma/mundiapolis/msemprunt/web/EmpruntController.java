package ma.mundiapolis.msemprunt.web;

import lombok.RequiredArgsConstructor;
import ma.mundiapolis.msemprunt.dto.EmpruntReqDto;
import ma.mundiapolis.msemprunt.dto.EmpruntRespDto;
import ma.mundiapolis.msemprunt.services.EmpruntService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emprunts")
@RequiredArgsConstructor
public class EmpruntController {

    private final EmpruntService empruntService;

    /**
     * Créer un nouvel emprunt
     * POST /api/emprunts
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpruntRespDto creerEmprunt(@RequestBody EmpruntReqDto empruntReqDto) {
        return empruntService.creerEmprunt(empruntReqDto);
    }

    /**
     * Récupérer un emprunt par ID avec détails enrichis
     * GET /api/emprunts/{id}
     */
    @GetMapping("/{id}")
    public EmpruntRespDto getEmpruntById(@PathVariable Long id) {
        return empruntService.getEmpruntById(id);
    }

    /**
     * Retourner un livre emprunté
     * PUT /api/emprunts/{id}/retourner
     */
    @PutMapping("/{id}/retourner")
    public EmpruntRespDto retournerLivre(@PathVariable Long id) {
        return empruntService.retournerLivre(id);
    }

    /**
     * Modifier un emprunt (dates)
     * PUT /api/emprunts/{id}
     */
    @PutMapping("/{id}")
    public EmpruntRespDto modifierEmprunt(@PathVariable Long id, @RequestBody EmpruntReqDto empruntReqDto) {
        return empruntService.modifierEmprunt(id, empruntReqDto);
    }

    /**
     * Récupérer tous les emprunts d'un utilisateur
     * GET /api/emprunts/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public List<EmpruntRespDto> getEmpruntsByUserId(@PathVariable Long userId) {
        return empruntService.getEmpruntsByUserId(userId);
    }

    /**
     * Récupérer l'historique des emprunts d'un livre
     * GET /api/emprunts/livre/{livreId}
     */
    @GetMapping("/livre/{livreId}")
    public List<EmpruntRespDto> getEmpruntsByLivreId(@PathVariable Long livreId) {
        return empruntService.getEmpruntsByLivreId(livreId);
    }

    /**
     * Récupérer tous les emprunts en cours
     * GET /api/emprunts/en-cours
     */
    @GetMapping("/en-cours")
    public List<EmpruntRespDto> getEmpruntsEnCours() {
        return empruntService.getEmpruntsEnCours();
    }

    /**
     * Récupérer tous les emprunts en retard
     * GET /api/emprunts/en-retard
     */
    @GetMapping("/en-retard")
    public List<EmpruntRespDto> getEmpruntsEnRetard() {
        return empruntService.getEmpruntsEnRetard();
    }

    /**
     * Récupérer tous les emprunts
     * GET /api/emprunts
     */
    @GetMapping
    public List<EmpruntRespDto> getAllEmprunts() {
        return empruntService.getAllEmprunts();
    }

    /**
     * Forcer la mise à jour des statuts en retard (Debug)
     * POST /api/emprunts/force-update-retards
     */
    @PostMapping("/force-update-retards")
    public void forceUpdateRetards() {
        empruntService.updateEmpruntsEnRetard();
    }
}
