package com.pingcap.ecommerce.config;

import com.pingcap.ecommerce.exception.DataSourceNotFoundException;
import com.pingcap.ecommerce.exception.FailedToConnectException;
import com.pingcap.ecommerce.vo.MessageVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.*;

@Slf4j
@AllArgsConstructor
@ControllerAdvice
@Configuration
public class ErrorHandleConfiguration {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
    List<ObjectError> allErrors = ex.getBindingResult().getAllErrors();

    Map<String, String> errors = new HashMap<>();
    allErrors.forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    String defaultMessage = allErrors.isEmpty() ? "Failed to verify parameters." : allErrors.get(0).getDefaultMessage();
    MessageVO<?> resultVO = new MessageVO<>(
        HttpStatus.BAD_REQUEST.value(), defaultMessage, errors
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resultVO);
  }

  @ExceptionHandler(FailedToConnectException.class)
  public ResponseEntity<?> handleDataSourceConnectExceptions(FailedToConnectException ex) {
    MessageVO<?> resultVO = new MessageVO<>(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resultVO);
  }

  @ExceptionHandler(DataSourceNotFoundException.class)
  public ResponseEntity<?> handleDataSourceNotFoundExceptions(DataSourceNotFoundException ex) {
    MessageVO<?> resultVO = new MessageVO<>(HttpStatus.NOT_FOUND.value(), ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resultVO);
  }


}
