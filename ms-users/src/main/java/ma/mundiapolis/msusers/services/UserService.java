package ma.mundiapolis.msusers.services;

import ma.mundiapolis.msusers.dto.UserReqDto;
import ma.mundiapolis.msusers.dto.UserRespDto;

import java.util.List;

public interface UserService {

    UserRespDto createUser(UserReqDto userReqDto);
    UserRespDto getUserById(Long id);
    List<UserRespDto> getAllUsers();
    UserRespDto updateUser(Long id, UserReqDto userReqDto);
    void deleteUser(Long id);
    UserRespDto getUserByEmail(String email);
}
