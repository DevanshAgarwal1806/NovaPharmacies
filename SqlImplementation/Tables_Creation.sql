CREATE TABLE DOCTOR (
    daid INT PRIMARY KEY,
    dname VARCHAR2(20),
    speciality VARCHAR2(20),
    years_of_experience INT
);

-- Depends on Doctor
CREATE TABLE PATIENT (
    paid INT PRIMARY KEY,
    pname VARCHAR2(20),
    paddress VARCHAR2(40),
    page INT,
    primary_physician INT,
    FOREIGN KEY (primary_physician) REFERENCES DOCTOR(daid) ON DELETE CASCADE
);

CREATE TABLE PHARMACEUTICAL_COMPANY (
    phcname VARCHAR2(20) PRIMARY KEY,
    phcphone VARCHAR2(20)
);

CREATE TABLE PHARMACY (
    phname VARCHAR2(20),
    phaddress VARCHAR2(40),
    phphone VARCHAR2(20),
    PRIMARY KEY (phname, phaddress)
);

-- Depends on Pharmaceutical Company
CREATE TABLE DRUG (
    phcompany VARCHAR2(20),
    trade_name VARCHAR2(20),
    formula VARCHAR2(20),
    PRIMARY KEY (phcompany, trade_name),
    FOREIGN KEY (phcompany) REFERENCES PHARMACEUTICAL_COMPANY(phcname) ON DELETE CASCADE
);

-- Depends on (Pharmaceutical Company, Trade Name), (Doctor), (Patient)
CREATE TABLE PRESCRIPTION (
    doctor INT,
    patient INT,
    pharma_company VARCHAR2(20),
    drug_name VARCHAR2(20),
    prescription_date DATE,
    quantity INT,
    PRIMARY KEY (doctor, patient, pharma_company, drug_name),
    FOREIGN KEY (doctor) REFERENCES DOCTOR (daid) ON DELETE CASCADE, 
    FOREIGN KEY (patient) REFERENCES PATIENT (paid) ON DELETE CASCADE,
    FOREIGN KEY (pharma_company, drug_name) REFERENCES DRUG (phcompany, trade_name) ON DELETE CASCADE
);

-- Depends on (Pharmacy name, Pharmacy address), (Pharmaceutical Company, Trade Name)
CREATE TABLE PHARMACY_DRUGS (
    phaname VARCHAR2(20),
    pha_address VARCHAR2(40),
    pharma_company VARCHAR2(20),
    drug_name  VARCHAR(20),
    price INT,
    PRIMARY KEY (phaname, pha_address, pharma_company, drug_name),
    FOREIGN KEY (phaname, pha_address) REFERENCES PHARMACY (phname, phaddress) ON DELETE CASCADE,
    FOREIGN KEY (pharma_company, drug_name) REFERENCES DRUG (phcompany, trade_name) ON DELETE CASCADE
);

-- Depends on (Pharmacy name, Pharmacy address), Pharmaceutical Company
CREATE TABLE PHARMACY_CONTRACT (
    phaname VARCHAR2(20),
    pha_address VARCHAR2(40),
    pharma_company VARCHAR2(20),
    start_date DATE,
    end_date DATE,
    content VARCHAR2(50),
    supervisor VARCHAR2(20),
    PRIMARY KEY (phaname, pha_address, pharma_company),
    FOREIGN KEY (phaname, pha_address) REFERENCES PHARMACY(phname, phaddress) ON DELETE CASCADE,
    FOREIGN KEY (pharma_company) REFERENCES PHARMACEUTICAL_COMPANY(phcname) ON DELETE CASCADE
);