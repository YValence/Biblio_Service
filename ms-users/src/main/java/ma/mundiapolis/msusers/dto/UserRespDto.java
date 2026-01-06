package ma.mundiapolis.msusers.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRespDto {

    private Long id;
    private String nom;
    private String email;
    private String adresse;
    private String tel;
}
