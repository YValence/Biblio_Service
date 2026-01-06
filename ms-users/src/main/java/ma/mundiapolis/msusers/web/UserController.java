package ma.mundiapolis.msusers.web;

import lombok.RequiredArgsConstructor;
import ma.mundiapolis.msusers.dto.UserReqDto;
import ma.mundiapolis.msusers.dto.UserRespDto;
import ma.mundiapolis.msusers.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/addUser")
    @ResponseStatus(HttpStatus.CREATED)
    public UserRespDto createUser(@RequestBody UserReqDto userReqDto) {
        return userService.createUser(userReqDto);
    }

    @GetMapping("/{id}")
    public UserRespDto getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/AllUser")
    public List<UserRespDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/email/{email}")
    public UserRespDto getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @PutMapping("/{id}")
    public UserRespDto updateUser(@PathVariable Long id, @RequestBody UserReqDto userReqDto) {
        return userService.updateUser(id, userReqDto);
    }

    @DeleteMapping("/DelUser/{id}") // ✅ Correction : DelUsuer -> DelUser
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}