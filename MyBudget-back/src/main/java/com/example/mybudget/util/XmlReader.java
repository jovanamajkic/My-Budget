package com.example.mybudget.util;

import com.example.mybudget.models.entities.AccountEntity;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Unmarshaller;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class XmlReader {
    private static final String PATH = "my_budget_data.xml";

    public static List<AccountEntity> readXml() {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(Accounts.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            InputStream inputStream = XmlReader.class.getClassLoader().getResourceAsStream(PATH);
            if (inputStream == null) {
                throw new FileNotFoundException("File not found: " + PATH);
            }
            Accounts accounts = (Accounts) unmarshaller.unmarshal(inputStream);
            return accounts.getAccounts();
        } catch (JAXBException | FileNotFoundException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @XmlRootElement(name = "Accounts")
    public static class Accounts {
        private List<AccountEntity> accounts;

        @XmlElement(name = "Account")
        public List<AccountEntity> getAccounts() {
            return accounts;
        }

        public void setAccounts(List<AccountEntity> accounts) {
            this.accounts = accounts;
        }
    }
}
