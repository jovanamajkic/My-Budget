package com.example.mybudget.models.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String currency;
    @NotNull
    private BigDecimal balance;
}
