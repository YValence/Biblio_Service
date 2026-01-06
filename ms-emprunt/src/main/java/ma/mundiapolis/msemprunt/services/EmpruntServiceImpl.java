package ma.mundiapolis.msemprunt.services;

import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import ma.mundiapolis.msemprunt.clients.LivreClient;
import ma.mundiapolis.msemprunt.clients.UserClient;
import ma.mundiapolis.msemprunt.dto.EmpruntReqDto;
import ma.mundiapolis.msemprunt.dto.EmpruntRespDto;
import ma.mundiapolis.msemprunt.dto.LivreDto;
import ma.mundiapolis.msemprunt.dto.UserDto;
import ma.mundiapolis.msemprunt.entities.Emprunt;
import ma.mundiapolis.msemprunt.enums.StatutEmprunt;
import ma.mundiapolis.msemprunt.mappers.EmpruntMapper;
import ma.mundiapolis.msemprunt.repositories.EmpruntRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpruntServiceImpl implements EmpruntService {

    private final EmpruntRepo empruntRepo;
    private final EmpruntMapper empruntMapper;
    private final UserClient userClient;
    private final LivreClient livreClient;

    @Override
    @Transactional
    public EmpruntRespDto creerEmprunt(EmpruntReqDto empruntReqDto) {
        // 1. Vérifier que l'utilisateur existe
        UserDto user;
        try {
            user = userClient.getUserById(empruntReqDto.getUtilisateurId());
        } catch (FeignException.NotFound e) {
            throw new EntityNotFoundException(
                    "Utilisateur avec l'id " + empruntReqDto.getUtilisateurId() + " introuvable");
        }

        // 2. Vérifier que le livre existe et est disponible
        LivreDto livre;
        try {
            livre = livreClient.getLivreById(empruntReqDto.getLivreId());
        } catch (FeignException.NotFound e) {
            throw new EntityNotFoundException("Livre avec l'id " + empruntReqDto.getLivreId() + " introuvable");
        }

        // 3. Vérifier qu'il y a des exemplaires disponibles
        if (livre.getQuantiteDisponible() == null || livre.getQuantiteDisponible() <= 0) {
            throw new IllegalStateException("Aucun exemplaire disponible pour ce livre");
        }

        // Limit check: Max 3 active loans per user
        List<Emprunt> activeLoans = empruntRepo.findByUtilisateurIdAndStatut(
                empruntReqDto.getUtilisateurId(),
                StatutEmprunt.EN_COURS);
        if (activeLoans.size() >= 3) {
            throw new IllegalStateException("L'utilisateur a atteint la limite de 3 emprunts actifs");
        }

        // 4. Vérifier que l'utilisateur n'a pas déjà emprunté ce livre (et ne l'a pas
        // retourné)
        empruntRepo.findByUtilisateurIdAndLivreIdAndStatut(
                empruntReqDto.getUtilisateurId(),
                empruntReqDto.getLivreId(),
                StatutEmprunt.EN_COURS).ifPresent(e -> {
                    throw new IllegalStateException(
                            "L'utilisateur a déjà emprunté ce livre et ne l'a pas encore retourné");
                });

        // 5. Décrémenter la quantité disponible via ms-livre
        try {
            livreClient.emprunterLivre(empruntReqDto.getLivreId());
        } catch (FeignException e) {
            throw new IllegalStateException("Erreur lors de l'emprunt du livre : " + e.getMessage());
        }

        // 6. Créer l'emprunt
        Integer dureePrevue = empruntReqDto.getDureePrevueJours() != null ? empruntReqDto.getDureePrevueJours() : 14;

        Emprunt emprunt = Emprunt.builder()
                .utilisateurId(empruntReqDto.getUtilisateurId())
                .livreId(empruntReqDto.getLivreId())
                .dateEmprunt(LocalDateTime.now())
                .dateRetourPrevue(LocalDateTime.now().plusDays(dureePrevue))
                .statut(StatutEmprunt.EN_COURS)
                .build();

        Emprunt savedEmprunt = empruntRepo.save(emprunt);

        // 7. Enrichir la réponse avec les données user et livre
        return enrichirEmprunt(savedEmprunt, user, livre);
    }

    @Override
    public EmpruntRespDto getEmpruntById(Long id) {
        Emprunt emprunt = empruntRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Emprunt avec l'id " + id + " introuvable"));

        return enrichirEmpruntAvecClients(emprunt);
    }

    @Override
    @Transactional
    public EmpruntRespDto retournerLivre(Long empruntId) {
        // 1. Récupérer l'emprunt
        Emprunt emprunt = empruntRepo.findById(empruntId)
                .orElseThrow(() -> new EntityNotFoundException("Emprunt avec l'id " + empruntId + " introuvable"));

        // 2. Vérifier que le livre n'a pas déjà été retourné
        if (emprunt.getStatut() == StatutEmprunt.RETOURNE) {
            throw new IllegalStateException("Ce livre a déjà été retourné");
        }

        // 3. Incrémenter la quantité disponible via ms-livre
        LivreDto livre;
        try {
            livre = livreClient.retournerLivre(emprunt.getLivreId());
        } catch (FeignException e) {
            throw new IllegalStateException("Erreur lors du retour du livre : " + e.getMessage());
        }

        // 4. Mettre à jour l'emprunt
        emprunt.setDateRetourEffective(LocalDateTime.now());
        emprunt.setStatut(StatutEmprunt.RETOURNE);

        Emprunt updatedEmprunt = empruntRepo.save(emprunt);

        // 5. Enrichir la réponse
        UserDto user = userClient.getUserById(emprunt.getUtilisateurId());
        return enrichirEmprunt(updatedEmprunt, user, livre);
    }

    @Override
    public List<EmpruntRespDto> getEmpruntsByUserId(Long userId) {
        // Vérifier que l'utilisateur existe
        try {
            userClient.getUserById(userId);
        } catch (FeignException.NotFound e) {
            throw new EntityNotFoundException("Utilisateur avec l'id " + userId + " introuvable");
        }

        List<Emprunt> emprunts = empruntRepo.findByUtilisateurId(userId);
        return emprunts.stream()
                .map(this::enrichirEmpruntAvecClients)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmpruntRespDto> getEmpruntsByLivreId(Long livreId) {
        // Vérifier que le livre existe
        try {
            livreClient.getLivreById(livreId);
        } catch (FeignException.NotFound e) {
            throw new EntityNotFoundException("Livre avec l'id " + livreId + " introuvable");
        }

        List<Emprunt> emprunts = empruntRepo.findByLivreId(livreId);
        return emprunts.stream()
                .map(this::enrichirEmpruntAvecClients)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmpruntRespDto> getEmpruntsEnCours() {
        List<Emprunt> emprunts = empruntRepo.findByStatut(StatutEmprunt.EN_COURS);
        return emprunts.stream()
                .map(this::enrichirEmpruntAvecClients)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmpruntRespDto> getEmpruntsEnRetard() {
        // Récupérer les emprunts dont la date de retour prévue est dépassée et qui sont
        // encore EN_COURS
        List<Emprunt> emprunts = empruntRepo.findByDateRetourPrevueBeforeAndStatut(
                LocalDateTime.now(),
                StatutEmprunt.EN_COURS);

        // Mettre à jour leur statut en EN_RETARD (optionnel)
        emprunts.forEach(emprunt -> {
            if (emprunt.getStatut() == StatutEmprunt.EN_COURS) {
                emprunt.setStatut(StatutEmprunt.EN_RETARD);
                empruntRepo.save(emprunt);
            }
        });

        return emprunts.stream()
                .map(this::enrichirEmpruntAvecClients)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmpruntRespDto> getAllEmprunts() {
        return empruntRepo.findAll().stream()
                .map(this::enrichirEmpruntAvecClients)
                .collect(Collectors.toList());
    }

    // Méthode helper pour enrichir un emprunt avec les données des clients Feign
    private EmpruntRespDto enrichirEmpruntAvecClients(Emprunt emprunt) {
        UserDto user = null;
        LivreDto livre = null;

        try {
            user = userClient.getUserById(emprunt.getUtilisateurId());
        } catch (FeignException e) {
            // Si l'utilisateur n'existe plus, on continue sans ses données
        }

        try {
            livre = livreClient.getLivreById(emprunt.getLivreId());
        } catch (FeignException e) {
            // Si le livre n'existe plus, on continue sans ses données
        }

        return enrichirEmprunt(emprunt, user, livre);
    }

    // Méthode helper pour construire EmpruntRespDto avec données enrichies
    private EmpruntRespDto enrichirEmprunt(Emprunt emprunt, UserDto user, LivreDto livre) {
        EmpruntRespDto dto = empruntMapper.toDto(emprunt);
        dto.setUtilisateur(user);
        dto.setLivre(livre);
        return dto;
    }

    @Override
    @Transactional
    public EmpruntRespDto modifierEmprunt(Long id, EmpruntReqDto empruntReqDto) {
        Emprunt emprunt = empruntRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Emprunt avec l'id " + id + " introuvable"));

        if (empruntReqDto.getDateEmprunt() != null) {
            emprunt.setDateEmprunt(empruntReqDto.getDateEmprunt());
        }

        if (empruntReqDto.getDureePrevueJours() != null) {
            // Recalculate return date based on new duration and (potentially new) start
            // date
            emprunt.setDateRetourPrevue(emprunt.getDateEmprunt().plusDays(empruntReqDto.getDureePrevueJours()));
        }

        // If the user wants to set a specific return date directly (if the DTO
        // supported it), we could do that too.
        // But the current DTO usually has duration. Let's check DTO.
        // Assuming the requirement "modification de la date d'emprunt" implies we can
        // change the start date.
        // The return date usually follows the duration, but sometimes manual override
        // is needed.
        // Let's assume re-calculating from duration is safer, OR if we want to allow
        // explicit date return setting?
        // The DTO has 'dureePrevueJours'.
        // If we want to allow setting exact return date, we might need to update the
        // DTO or just use the duration logic.

        Emprunt savedEmprunt = empruntRepo.save(emprunt);
        return enrichirEmpruntAvecClients(savedEmprunt);
    }

    @Override
    @Transactional
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 60000) // Toutes les minutes
    public void updateEmpruntsEnRetard() {
        System.out.println("Vérification des emprunts en retard...");
        List<Emprunt> empruntsEnRetard = empruntRepo.findByDateRetourPrevueBeforeAndStatut(
                LocalDateTime.now(),
                StatutEmprunt.EN_COURS);

        if (!empruntsEnRetard.isEmpty()) {
            empruntsEnRetard.forEach(emprunt -> {
                emprunt.setStatut(StatutEmprunt.EN_RETARD);
            });
            empruntRepo.saveAll(empruntsEnRetard);
            System.out.println(
                    "Mise à jour des emprunts en retard : " + empruntsEnRetard.size() + " emprunts mis à jour.");
        }
    }
}