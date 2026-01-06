package ma.mundiapolis.msusers.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import ma.mundiapolis.msusers.repositories.UserRepo;
import org.springframework.stereotype.Service;
import ma.mundiapolis.msusers.dto.UserReqDto;
import ma.mundiapolis.msusers.dto.UserRespDto;
import ma.mundiapolis.msusers.entities.User;
import ma.mundiapolis.msusers.mapper.UserMapper;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService{

    private final UserRepo userRepository;
    private final UserMapper userMapper;

    @Override
    public UserRespDto createUser(UserReqDto userReqDto) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(userReqDto.getEmail())) {
            throw new IllegalStateException("Un utilisateur avec cet email existe déjà");
        }

        User user = userMapper.toEntity(userReqDto);
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    @Override
    public UserRespDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur avec l'id " + id + " introuvable"));
        return userMapper.toDto(user);
    }

    @Override
    public List<UserRespDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserRespDto updateUser(Long id, UserReqDto userReqDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur avec l'id " + id + " introuvable"));

        // ✅ Vérifie si l'email est déjà utilisé par un AUTRE utilisateur
        if (userRepository.existsByEmailAndIdNot(userReqDto.getEmail(), id)) {
            throw new IllegalStateException("Cet email est déjà utilisé par un autre utilisateur");
        }

        // ✅ Mise à jour de TOUTES les informations
        existingUser.setNom(userReqDto.getNom());
        existingUser.setEmail(userReqDto.getEmail());
        existingUser.setAdresse(userReqDto.getAdresse());
        existingUser.setTel(userReqDto.getTel());

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur avec l'id " + id + " introuvable"));
        userRepository.delete(user);
        // ✅ Après suppression, l'email redevient automatiquement disponible
    }

    @Override
    public UserRespDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur avec l'email " + email + " introuvable"));
        return userMapper.toDto(user);
    }
}