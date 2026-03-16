package com.nurtura.platform.common.api;

import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
		return buildValidationResponse(exception.getBindingResult());
	}

	@ExceptionHandler(BindException.class)
	public ResponseEntity<ApiErrorResponse> handleBindException(BindException exception) {
		return buildValidationResponse(exception.getBindingResult());
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException exception) {
		ApiErrorResponse response = new ApiErrorResponse(
				Instant.now(),
				HttpStatus.BAD_REQUEST.value(),
				"VALIDATION_ERROR",
				"Request validation failed.",
				exception.getConstraintViolations().stream()
						.map(violation -> new FieldValidationError(violation.getPropertyPath().toString(), violation.getMessage()))
						.toList()
		);

		return ResponseEntity.badRequest().body(response);
	}

	private ResponseEntity<ApiErrorResponse> buildValidationResponse(BindingResult bindingResult) {
		List<FieldValidationError> fieldErrors = bindingResult.getFieldErrors().stream()
				.map(error -> new FieldValidationError(error.getField(), error.getDefaultMessage()))
				.toList();

		ApiErrorResponse response = new ApiErrorResponse(
				Instant.now(),
				HttpStatus.BAD_REQUEST.value(),
				"VALIDATION_ERROR",
				"Request validation failed.",
				fieldErrors
		);

		return ResponseEntity.badRequest().body(response);
	}
}
