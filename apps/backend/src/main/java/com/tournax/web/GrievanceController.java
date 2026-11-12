package com.tournax.web;

import com.tournax.application.GrievanceService;
import com.tournax.application.dto.SubmitGrievanceRequest;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/seasons/{season}/grievances")
public class GrievanceController {

    private final GrievanceService grievanceService;

    public GrievanceController(GrievanceService grievanceService) {
        this.grievanceService = grievanceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> submit(@PathVariable int season, @Valid @RequestBody SubmitGrievanceRequest body) {
        UUID id = grievanceService.submit(season, body);
        return Map.of("id", id.toString(), "message", "Grievance submitted. The committee will review it.");
    }
}
