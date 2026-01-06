package ma.mundiapolis.msemprunt.services;

import ma.mundiapolis.msemprunt.dto.EmpruntReqDto;
import ma.mundiapolis.msemprunt.dto.EmpruntRespDto;

import java.util.List;

public interface EmpruntService {

    // Créer un nouvel emprunt
    EmpruntRespDto creerEmprunt(EmpruntReqDto empruntReqDto);

    // Récupérer un emprunt par ID avec détails
    EmpruntRespDto getEmpruntById(Long id);

    // Retourner un livre emprunté
    EmpruntRespDto retournerLivre(Long empruntId);

    // Liste des emprunts d'un utilisateur
    List<EmpruntRespDto> getEmpruntsByUserId(Long userId);

    // Historique des emprunts d'un livre
    List<EmpruntRespDto> getEmpruntsByLivreId(Long livreId);

    // Liste de tous les emprunts en cours
    List<EmpruntRespDto> getEmpruntsEnCours();

    // Liste des emprunts en retard
    List<EmpruntRespDto> getEmpruntsEnRetard();

    // Liste de tous les emprunts
    List<EmpruntRespDto> getAllEmprunts();

    // Modifier un emprunt (dates)
    EmpruntRespDto modifierEmprunt(Long id, EmpruntReqDto empruntReqDto);

    void updateEmpruntsEnRetard();
}
