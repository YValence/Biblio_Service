package ma.mundiapolis.msemprunt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LivreDto {

    private Long id;
    private String titre;
    private String auteur;
    private String categorie;
    private String isbn;
    private Integer quantiteTotale;
    private Integer quantiteDisponible;
    private Integer quantiteEmpruntee;
}
