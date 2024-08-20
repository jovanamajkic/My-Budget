package com.example.mybudget.controllers;

import com.example.mybudget.models.dto.Account;
import com.example.mybudget.models.requests.AccountRequest;
import com.example.mybudget.services.AccountService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @PostConstruct
    private void postConstruct() {
        service.importData();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Account create(@RequestBody @Valid AccountRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<Account> getAll() {
        return service.getAll();
    }

    @GetMapping("/available/{currency}")
    public BigDecimal getAvailableBalance(@PathVariable String currency) {
        return service.getAvailableBalance(currency);
    }

    @DeleteMapping
    public void deleteAll() {
        service.deleteAllData();
    }
}
