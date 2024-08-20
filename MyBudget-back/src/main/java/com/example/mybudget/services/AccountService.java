package com.example.mybudget.services;

import com.example.mybudget.models.dto.Account;
import com.example.mybudget.models.requests.AccountRequest;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    Account create(AccountRequest request);

    List<Account> getAll();

    void deleteAllData();

    void importData();

    BigDecimal getAvailableBalance(String currency);
}
