package com.example.mybudget;

import com.example.mybudget.models.dto.Account;
import com.example.mybudget.models.entities.AccountEntity;
import com.example.mybudget.models.requests.AccountRequest;
import com.example.mybudget.repositories.AccountEntityRepository;
import com.example.mybudget.repositories.TransactionEntityRepository;
import com.example.mybudget.services.impl.AccountServiceImpl;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {
    @Mock
    private AccountEntityRepository accountRepository;

    @Mock
    private TransactionEntityRepository transactionRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private AccountServiceImpl accountService;

    private AccountEntity accountEntity;
    private AccountRequest accountRequest;

    @BeforeEach
    void setUp() {
        accountEntity = new AccountEntity();
        accountEntity.setId(1);
        accountEntity.setName("Name");
        accountEntity.setBalance(BigDecimal.valueOf(1000));
        accountEntity.setCurrency("USD");

        accountRequest = new AccountRequest();
        accountRequest.setName("Name");
        accountRequest.setBalance(BigDecimal.valueOf(1000));
        accountRequest.setCurrency("USD");
    }

    @Test
    void testImportData() {
        when(accountRepository.count()).thenReturn(0L);
        when(accountRepository.save(any(AccountEntity.class))).thenReturn(accountEntity);

        accountService.importData();

        verify(accountRepository, times(4)).save(any(AccountEntity.class));
        verify(transactionRepository, times(3)).saveAll(anyList());
    }

    @Test
    void testGetAvailableBalance() {
        when(accountRepository.findAll()).thenReturn(Collections.singletonList(accountEntity));

        BigDecimal balance = accountService.getAvailableBalance("USD");

        assertEquals(BigDecimal.valueOf(1000), balance);
    }

    @Test
    void testCreate() {
        when(modelMapper.map(any(AccountRequest.class), eq(AccountEntity.class))).thenReturn(accountEntity);
        when(modelMapper.map(any(AccountEntity.class), eq(Account.class))).thenReturn(new Account());
        when(accountRepository.saveAndFlush(any(AccountEntity.class))).thenReturn(accountEntity);

        Account account = accountService.create(accountRequest);

        assertNotNull(account);
        verify(accountRepository, times(1)).saveAndFlush(any(AccountEntity.class));
    }

    @Test
    void testGetAll() {
        when(accountRepository.findAll()).thenReturn(Collections.singletonList(accountEntity));
        when(modelMapper.map(any(AccountEntity.class), eq(Account.class))).thenReturn(new Account());

        List<Account> accounts = accountService.getAll();

        assertFalse(accounts.isEmpty());
        verify(accountRepository, times(1)).findAll();
    }

    @Test
    void testDeleteAllData() {
        accountService.deleteAllData();

        verify(transactionRepository, times(1)).deleteAll();
        verify(accountRepository, times(1)).deleteAll();
    }
}
