package com.nurtura.platform.modules.identity.dto;

import java.util.List;

public record AuthSessionResponse(String username, List<String> roles) {
}
