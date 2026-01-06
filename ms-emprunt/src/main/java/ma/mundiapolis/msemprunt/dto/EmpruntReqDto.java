package ma.mundiapolis.msemprunt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmpruntReqDto {

    private Long utilisateurId;
    private Long livreId;
    private Integer dureePrevueJours;
    private java.time.LocalDateTime dateEmprunt;
}
