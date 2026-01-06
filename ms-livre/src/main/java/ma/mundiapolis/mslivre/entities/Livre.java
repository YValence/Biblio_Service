package ma.mundiapolis.mslivre.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.mundiapolis.mslivre.dto.Category;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Livre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String auteur;
    private Category categorie;
    private String isbn;


    private Integer quantiteTotale;      // Nombre total de livres
    private Integer quantiteDisponible;  // Nombre de livres disponibles
    private Integer quantiteEmpruntee;
}
