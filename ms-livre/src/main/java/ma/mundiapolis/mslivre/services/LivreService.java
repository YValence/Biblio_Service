package ma.mundiapolis.mslivre.services;

import ma.mundiapolis.mslivre.dto.LivreReqDto;
import ma.mundiapolis.mslivre.dto.LivreRespDto;
import ma.mundiapolis.mslivre.entities.Livre;

import ma.mundiapolis.mslivre.services.LivreServiceImp;

import java.util.List;

public interface LivreService {

    LivreRespDto getBookById(Long id);

    List<LivreRespDto> getAllBooks();

    LivreRespDto addBook(LivreReqDto livreReqDto);

    LivreRespDto updateBook(Long id, LivreReqDto livreReqDto);

    void deleteBook(Long id);

    LivreRespDto emprunterLivre(Long id);

    LivreRespDto retournerLivre(Long id);
}
