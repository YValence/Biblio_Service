package ma.mundiapolis.msusers.mapper;

import ma.mundiapolis.msusers.dto.UserReqDto;
import ma.mundiapolis.msusers.dto.UserRespDto;
import ma.mundiapolis.msusers.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    User toEntity(UserReqDto userReqDto);
    UserRespDto toDto(User user);
}
