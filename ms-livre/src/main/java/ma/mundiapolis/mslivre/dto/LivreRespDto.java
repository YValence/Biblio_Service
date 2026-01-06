package ma.mundiapolis.mslivre.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LivreRespDto {

    private Long id;
    private String titre;
    private String auteur;
    private Category categorie;
    private String isbn;

    private Integer quantiteTotale;
    private Integer quantiteDisponible;
    private Integer quantiteEmpruntee;
}
