package com.tournax.application.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateTeamRequest(
    @Size(max = 30) String teamName,
    @Size(max = 2048) String crestUrl,
    @Pattern(regexp = "[AB]") String groupLetter
) {}
