package com.example.mybudget;

import com.example.mybudget.exceptions.InsufficientBalanceException;
import com.example.mybudget.models.dto.Transaction;
import com.example.mybudget.models.entities.AccountEntity;
import com.example.mybudget.models.entities.TransactionEntity;
import com.example.mybudget.models.requests.TransactionRequest;
import com.example.mybudget.repositories.AccountEntityRepository;
import com.example.mybudget.repositories.TransactionEntityRepository;
import com.example.mybudget.services.impl.TransactionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {
    @Mock
    private TransactionEntityRepository transactionRepository;

    @Mock
    private AccountEntityRepository accountRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private TransactionRequest transactionRequest;
    private TransactionEntity transactionEntity;
    private AccountEntity accountEntity;

    @BeforeEach
    void setUp() {
        accountEntity = new AccountEntity();
        accountEntity.setId(1);
        accountEntity.setName("Name");
        accountEntity.setBalance(BigDecimal.valueOf(1000));
        accountEntity.setCurrency("USD");

        transactionRequest = new TransactionRequest();
        transactionRequest.setAccountId(1);
        transactionRequest.setDescription("Description");
        transactionRequest.setAmount(BigDecimal.valueOf(-500));
        transactionRequest.setCurrency("USD");

        transactionEntity = new TransactionEntity();
        transactionEntity.setId(1);
        transactionEntity.setAmount(BigDecimal.valueOf(-500));
        transactionEntity.setCurrency("USD");
        transactionEntity.setDescription("Description");
        transactionEntity.setAccount(accountEntity);
    }

    @Test
    void testCreateTransaction_success() {
        when(accountRepository.findById(anyInt())).thenReturn(Optional.of(accountEntity));
        when(modelMapper.map(any(TransactionRequest.class), eq(TransactionEntity.class))).thenReturn(transactionEntity);
        when(modelMapper.map(any(TransactionEntity.class), eq(Transaction.class))).thenReturn(new Transaction());
        when(transactionRepository.saveAndFlush(any(TransactionEntity.class))).thenReturn(transactionEntity);

        Transaction transaction = transactionService.create(transactionRequest);

        assertNotNull(transaction);
        verify(accountRepository, times(1)).saveAndFlush(any(AccountEntity.class));
        verify(transactionRepository, times(1)).saveAndFlush(any(TransactionEntity.class));
    }

    @Test
    void testCreateTransaction_insufficientFunds() {
        transactionRequest.setAmount(BigDecimal.valueOf(-1500));
        transactionEntity.setAmount(BigDecimal.valueOf(-1500));

        when(modelMapper.map(any(TransactionRequest.class), eq(TransactionEntity.class))).thenReturn(transactionEntity);
        when(accountRepository.findById(anyInt())).thenReturn(Optional.of(accountEntity));

        InsufficientBalanceException exception = assertThrows(
                InsufficientBalanceException.class,
                () -> transactionService.create(transactionRequest)
        );

        assertEquals("Insufficient funds in the account.", exception.getMessage());
        verify(accountRepository, never()).saveAndFlush(any(AccountEntity.class));
        verify(transactionRepository, never()).saveAndFlush(any(TransactionEntity.class));
    }

    @Test
    void testGetAllTransactions() {
        when(transactionRepository.findAll()).thenReturn(Collections.singletonList(transactionEntity));
        when(modelMapper.map(any(TransactionEntity.class), eq(Transaction.class))).thenReturn(new Transaction());

        List<Transaction> transactions = transactionService.getAll();

        assertFalse(transactions.isEmpty());
        verify(transactionRepository, times(1)).findAll();
    }

    @Test
    void testGetTransactionsByAccount() {
        when(transactionRepository.findAllByAccount_Id(anyInt())).thenReturn(Collections.singletonList(transactionEntity));
        when(modelMapper.map(any(TransactionEntity.class), eq(Transaction.class))).thenReturn(new Transaction());

        List<Transaction> transactions = transactionService.getByAccount(1);

        assertFalse(transactions.isEmpty());
        verify(transactionRepository, times(1)).findAllByAccount_Id(1);
    }
}
