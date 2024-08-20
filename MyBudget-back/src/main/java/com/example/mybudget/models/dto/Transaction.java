package com.example.mybudget.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private Integer id;
    private String description;
    private BigDecimal amount;
    private String currency;
    private Account account;
}
