package com.example.mybudget.services.impl;

import com.example.mybudget.models.dto.Account;
import com.example.mybudget.models.entities.AccountEntity;
import com.example.mybudget.models.entities.TransactionEntity;
import com.example.mybudget.models.requests.AccountRequest;
import com.example.mybudget.repositories.AccountEntityRepository;
import com.example.mybudget.repositories.TransactionEntityRepository;
import com.example.mybudget.services.AccountService;
import com.example.mybudget.util.CurrencyExchange;
import com.example.mybudget.util.XmlReader;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {
    private final AccountEntityRepository accountRepository;
    private final TransactionEntityRepository transactionRepository;
    private final ModelMapper modelMapper;

    public AccountServiceImpl(AccountEntityRepository repository, TransactionEntityRepository transactionRepository, ModelMapper modelMapper) {
        this.accountRepository = repository;
        this.transactionRepository = transactionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public void importData() {
        if (accountRepository.count() == 0) {
            List<AccountEntity> accounts = XmlReader.readXml();

            for (AccountEntity account : accounts) {
                accountRepository.save(account);

                if (account.getTransactions() != null && !account.getTransactions().isEmpty()) {
                    for (TransactionEntity transaction : account.getTransactions()) {
                        transaction.setAccount(account);
                        transaction.setAmount(transaction.getAmount());
                        if (transaction.getCurrency() == null)
                            transaction.setCurrency(account.getCurrency());
                        transactionRepository.save(transaction);
                    }
                }
            }
        }
    }

    @Override
    public BigDecimal getAvailableBalance(String currency) {
        return accountRepository.findAll()
                .stream()
                .map(account -> {
                    BigDecimal balance = account.getBalance();
                    String accountCurrency = account.getCurrency();
                    if (!currency.equals(accountCurrency)) {
                        BigDecimal exchangeRate = CurrencyExchange.getExchangeRate(accountCurrency, currency);
                        balance = balance.multiply(exchangeRate);
                    }
                    return balance;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public Account create(AccountRequest request) {
        AccountEntity entity = modelMapper.map(request, AccountEntity.class);
        accountRepository.saveAndFlush(entity);
        return modelMapper.map(entity, Account.class);
    }

    @Override
    public List<Account> getAll() {
        return accountRepository.findAll()
                .stream()
                .map(accountEntity -> modelMapper.map(accountEntity, Account.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAllData() {
        transactionRepository.deleteAll();
        accountRepository.deleteAll();
    }

}
