package com.example.mybudget.repositories;

import com.example.mybudget.models.entities.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountEntityRepository extends JpaRepository<AccountEntity, Integer> {
}
