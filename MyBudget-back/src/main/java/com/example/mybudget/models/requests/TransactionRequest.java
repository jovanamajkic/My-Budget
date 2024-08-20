package com.example.mybudget.models.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionRequest {
    @NotBlank
    private String description;
    @NotNull
    private BigDecimal amount;
    @NotBlank
    private String currency;
    @NotNull
    private Integer accountId;
}
