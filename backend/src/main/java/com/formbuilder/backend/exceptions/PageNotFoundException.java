package com.formbuilder.backend.exceptions;

public class PageNotFoundException extends RuntimeException {
    public PageNotFoundException(String message) {
        super(message);
    }
}
