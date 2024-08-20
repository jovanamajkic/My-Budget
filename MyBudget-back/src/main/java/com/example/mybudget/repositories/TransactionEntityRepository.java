package com.example.mybudget.repositories;

import com.example.mybudget.models.entities.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionEntityRepository extends JpaRepository<TransactionEntity, Integer> {
    List<TransactionEntity> findAllByAccount_Id(Integer accountId);
}
