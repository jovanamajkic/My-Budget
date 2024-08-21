package com.example.mybudget.services.impl;

import com.example.mybudget.exceptions.InsufficientBalanceException;
import com.example.mybudget.models.dto.Transaction;
import com.example.mybudget.models.entities.AccountEntity;
import com.example.mybudget.models.entities.TransactionEntity;
import com.example.mybudget.models.requests.TransactionRequest;
import com.example.mybudget.repositories.AccountEntityRepository;
import com.example.mybudget.repositories.TransactionEntityRepository;
import com.example.mybudget.services.TransactionService;
import com.example.mybudget.util.CurrencyExchange;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {
    private final TransactionEntityRepository transactionRepository;
    private final AccountEntityRepository accountRepository;
    private final ModelMapper modelMapper;

    public TransactionServiceImpl(TransactionEntityRepository repository, AccountEntityRepository accountRepository, ModelMapper modelMapper) {
        this.transactionRepository = repository;
        this.accountRepository = accountRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Transaction create(TransactionRequest request) {
        TransactionEntity transaction = modelMapper.map(request, TransactionEntity.class);
        if (transaction == null) {
            throw new IllegalStateException("Transaction mapping failed.");
        }

        AccountEntity account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found for id: " + request.getAccountId()));

        BigDecimal amount = transaction.getAmount();
        if (!transaction.getCurrency().equals(account.getCurrency())) {
            BigDecimal exchangeRate = CurrencyExchange.getExchangeRate(transaction.getCurrency(), account.getCurrency());
            amount = transaction.getAmount().multiply(exchangeRate);
        }

        if (amount.signum() == -1 && amount.abs().compareTo(account.getBalance()) > 0) {
            throw new InsufficientBalanceException("Insufficient funds in the account.");
        }

        account.setBalance(account.getBalance().add(amount));
        accountRepository.saveAndFlush(account);
        transaction.setAccount(account);
        transactionRepository.saveAndFlush(transaction);
        return modelMapper.map(transaction, Transaction.class);
    }

    @Override
    public List<Transaction> getAll() {
        return convertList(transactionRepository.findAll());
    }

    @Override
    public List<Transaction> getByAccount(Integer accountId) {
        return convertList(transactionRepository.findAllByAccount_Id(accountId));
    }

    private List<Transaction> convertList(List<TransactionEntity> entities) {
        return entities
                .stream()
                .map(transactionEntity -> modelMapper.map(transactionEntity, Transaction.class))
                .collect(Collectors.toList());
    }

}
