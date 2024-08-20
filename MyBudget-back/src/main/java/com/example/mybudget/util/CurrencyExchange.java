package com.example.mybudget.util;

import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

public class CurrencyExchange {
    private static final String API_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

    public static BigDecimal getExchangeRate(String fromCurrency, String toCurrency) {
        String url = API_URL + fromCurrency.toLowerCase() + ".json";
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        if (response == null) {
            throw new IllegalArgumentException("Currency " + fromCurrency + " is not found.");
        }

        Map<String, Object> currencies = (Map<String, Object>) response.get(fromCurrency.toLowerCase());
        Object rate = currencies.get(toCurrency.toLowerCase());
        if (rate == null) {
            throw new IllegalArgumentException("Rate for currency " + toCurrency + " is not found.");
        }

        return new BigDecimal(rate.toString());
    }
}
