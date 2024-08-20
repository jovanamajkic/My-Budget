package com.example.mybudget.services;

import com.example.mybudget.models.dto.Transaction;
import com.example.mybudget.models.requests.TransactionRequest;

import java.util.List;

public interface TransactionService {
    Transaction create(TransactionRequest request);

    List<Transaction> getAll();

    List<Transaction> getByAccount(Integer accountId);
}
