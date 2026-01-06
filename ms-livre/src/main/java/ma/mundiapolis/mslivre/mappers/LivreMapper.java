package ma.mundiapolis.mslivre.mappers;

import ma.mundiapolis.mslivre.dto.LivreReqDto;
import ma.mundiapolis.mslivre.dto.LivreRespDto;
import ma.mundiapolis.mslivre.entities.Livre;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LivreMapper {

    Livre toEntity(LivreReqDto livreReqDto);
    LivreRespDto toDto(Livre livre);
}