package ma.mundiapolis.msemprunt.mappers;

import ma.mundiapolis.msemprunt.dto.EmpruntRespDto;
import ma.mundiapolis.msemprunt.entities.Emprunt;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmpruntMapper {

    EmpruntRespDto toDto(Emprunt emprunt);

}
