package com.example.mybudget.controllers;

import com.example.mybudget.models.dto.Transaction;
import com.example.mybudget.models.requests.TransactionRequest;
import com.example.mybudget.services.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Transaction create(@RequestBody @Valid TransactionRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<Transaction> getAll() {
        return service.getAll();
    }

    @GetMapping("/{accountId}")
    public List<Transaction> getByAccount(@PathVariable Integer accountId) {
        return service.getByAccount(accountId);
    }

}
