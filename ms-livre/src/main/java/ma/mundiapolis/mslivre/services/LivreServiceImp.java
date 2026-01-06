package ma.mundiapolis.mslivre.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import ma.mundiapolis.mslivre.dto.LivreReqDto;
import ma.mundiapolis.mslivre.dto.LivreRespDto;
import ma.mundiapolis.mslivre.entities.Livre;
import ma.mundiapolis.mslivre.mappers.LivreMapper;
import ma.mundiapolis.mslivre.repositories.LivreRepo;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LivreServiceImp implements LivreService {

    private final LivreMapper livreMapper;
    private final LivreRepo livreRepo;

    @Override
    public LivreRespDto getBookById(Long id) {
        Livre livre = livreRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livre with id " + id + " not found"));
        return livreMapper.toDto(livre);
    }

    @Override
    public java.util.List<LivreRespDto> getAllBooks() {
        return livreRepo.findAll().stream()
                .map(livreMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public LivreRespDto addBook(LivreReqDto livreReqDto) {
        Livre livre = livreMapper.toEntity(livreReqDto);

        // ✅ Initialiser les quantités lors de l'ajout
        if (livre.getQuantiteTotale() == null || livre.getQuantiteTotale() <= 0) {
            livre.setQuantiteTotale(1);
        }
        livre.setQuantiteEmpruntee(0);
        livre.setQuantiteDisponible(livre.getQuantiteTotale()); // disponible = totale au début

        Livre savedLivre = livreRepo.save(livre);
        return livreMapper.toDto(savedLivre);
    }

    @Override
    public LivreRespDto updateBook(Long id, LivreReqDto livreReqDto) {
        Livre existingLivre = livreRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livre with id " + id + " not found"));

        // ✅ Mettre à jour les informations basiques
        existingLivre.setTitre(livreReqDto.getTitre());
        existingLivre.setAuteur(livreReqDto.getAuteur());
        existingLivre.setCategorie(livreReqDto.getCategorie());
        existingLivre.setIsbn(livreReqDto.getIsbn());

        // ✅ Mettre à jour la quantité totale UNIQUEMENT si le bibliothécaire la modifie
        if (livreReqDto.getQuantiteTotale() != null) {
            int nouvelleQuantiteTotale = livreReqDto.getQuantiteTotale();

            // Vérifier que la nouvelle quantité totale n'est pas inférieure aux emprunts
            // actuels
            if (nouvelleQuantiteTotale < existingLivre.getQuantiteEmpruntee()) {
                throw new IllegalStateException(
                        "La quantité totale (" + nouvelleQuantiteTotale +
                                ") ne peut pas être inférieure à la quantité empruntée (" +
                                existingLivre.getQuantiteEmpruntee() + ")");
            }

            // Mettre à jour la quantité totale
            existingLivre.setQuantiteTotale(nouvelleQuantiteTotale);

            // ✅ Recalculer la quantité disponible : disponible = totale - empruntée
            existingLivre.setQuantiteDisponible(
                    existingLivre.getQuantiteTotale() - existingLivre.getQuantiteEmpruntee());
        }

        Livre updatedLivre = livreRepo.save(existingLivre);
        return livreMapper.toDto(updatedLivre);
    }

    @Override
    public void deleteBook(Long id) {
        Livre livre = livreRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livre with id " + id + " not found"));
        livreRepo.delete(livre);
    }

    @Override
    public LivreRespDto emprunterLivre(Long id) {
        Livre livre = livreRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livre with id " + id + " not found"));

        // ✅ Vérifier qu'il y a des exemplaires disponibles
        if (livre.getQuantiteDisponible() <= 0) {
            throw new IllegalStateException("Aucun exemplaire disponible pour ce livre");
        }

        // ✅ Incrémenter les emprunts
        livre.setQuantiteEmpruntee(livre.getQuantiteEmpruntee() + 1);

        // ✅ Recalculer la disponibilité : disponible = totale - empruntée
        livre.setQuantiteDisponible(livre.getQuantiteTotale() - livre.getQuantiteEmpruntee());

        Livre updatedLivre = livreRepo.save(livre);
        return livreMapper.toDto(updatedLivre);
    }

    @Override
    public LivreRespDto retournerLivre(Long id) {
        Livre livre = livreRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livre with id " + id + " not found"));

        // ✅ Vérifier qu'il y a des livres empruntés
        if (livre.getQuantiteEmpruntee() <= 0) {
            throw new IllegalStateException("Aucun exemplaire emprunté pour ce livre");
        }

        // ✅ Décrémenter les emprunts
        livre.setQuantiteEmpruntee(livre.getQuantiteEmpruntee() - 1);

        // ✅ Recalculer la disponibilité : disponible = totale - empruntée
        livre.setQuantiteDisponible(livre.getQuantiteTotale() - livre.getQuantiteEmpruntee());

        Livre updatedLivre = livreRepo.save(livre);
        return livreMapper.toDto(updatedLivre);
    }
}