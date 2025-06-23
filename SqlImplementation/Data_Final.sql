CREATE OR REPLACE PROCEDURE add_doctor (
    p_daid INT, p_dname VARCHAR2, p_speciality VARCHAR2, p_years_of_experience INT
) AS

    BEGIN
        INSERT INTO DOCTOR VALUES (p_daid, p_dname, p_speciality, p_years_of_experience);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Doctor added: ' || p_dname);
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            DBMS_OUTPUT.PUT_LINE('Error: Doctor with ID ' || p_daid || ' already exists.');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE delete_doctor (
    p_daid INT
) AS

    BEGIN
        DELETE FROM DOCTOR WHERE daid = p_daid;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Doctor deleted with ID: ' || p_daid);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: No doctor found with ID ' || p_daid);
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE update_doctor (
    p_daid INT, p_dname VARCHAR2, p_speciality VARCHAR2, p_years_of_experience INT
) AS

    BEGIN
        UPDATE DOCTOR
        SET dname = p_dname,
            speciality = p_speciality,
            years_of_experience = p_years_of_experience
        WHERE daid = p_daid;
        
        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No doctor found with ID ' || p_daid);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Doctor updated: ' || p_dname);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE add_patient (
    p_paid INT, p_pname VARCHAR2, p_paddress VARCHAR2, p_page INT, p_physician INT
) AS

    BEGIN
        INSERT INTO PATIENT VALUES (p_paid, p_pname, p_paddress, p_page, p_physician);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Patient added: ' || p_pname);
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            DBMS_OUTPUT.PUT_LINE('Error: Patient with ID ' || p_paid || ' already exists.');
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: No such doctor record found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/

CREATE OR REPLACE PROCEDURE delete_patient (
    p_paid INT
) AS

    BEGIN
        DELETE FROM PATIENT WHERE paid = p_paid;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Patient deleted with ID: ' || p_paid);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: No patient found with ID ' || p_paid);
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;
/

CREATE OR REPLACE PROCEDURE update_patient (
    p_paid INT, p_pname VARCHAR2, p_paddress VARCHAR2, p_page INT, p_physician INT
) AS

    BEGIN
        UPDATE PATIENT
        SET pname = p_pname,
            paddress = p_paddress,
            page = p_page,
            primary_physician = p_physician
        WHERE paid = p_paid;
        
        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No patient found with ID ' || p_paid);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Patient updated: ' || p_pname);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: No such doctor record found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/

CREATE OR REPLACE PROCEDURE add_pharmaceutical_company (
    p_name VARCHAR2, p_phone VARCHAR2
) AS

    BEGIN
        INSERT INTO PHARMACEUTICAL_COMPANY VALUES (p_name, p_phone);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmaceutical company added: ' || p_name);
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            DBMS_OUTPUT.PUT_LINE('Error: Pharmaceutical company ' || p_name || ' already exists.');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE delete_pharmaceutical_company (
    p_name VARCHAR2
) AS

    BEGIN
        DELETE FROM PHARMACEUTICAL_COMPANY WHERE phcname = p_name;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmaceutical company deleted: ' || p_name);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: No pharmaceutical company found with name ' || p_name);
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE update_pharmaceutical_company (
    p_name VARCHAR2, p_phone VARCHAR2
) AS

    BEGIN
        UPDATE PHARMACEUTICAL_COMPANY
        SET phcphone = p_phone
        WHERE phcname = p_name;
        
        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No pharmaceutical company found with name ' || p_name);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Pharmaceutical company updated: ' || p_name);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE add_drug (
    p_phcompany VARCHAR2, p_trade_name VARCHAR2, p_formula VARCHAR2
) AS

    BEGIN
        INSERT INTO DRUG VALUES (p_phcompany, p_trade_name, p_formula);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Drug added: ' || p_trade_name);
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            DBMS_OUTPUT.PUT_LINE('Error: Drug ' || p_trade_name || ' already exists.');
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: No such pharmaceutical company record found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/

CREATE OR REPLACE PROCEDURE delete_drug (
    p_phcompany VARCHAR2, p_trade_name VARCHAR2
) AS

    BEGIN
        DELETE FROM DRUG WHERE phcompany = p_phcompany AND trade_name = p_trade_name;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Drug deleted: ' || p_trade_name);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: No drug found with name ' || p_trade_name);
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE update_drug (
    p_phcompany VARCHAR2, p_trade_name VARCHAR2, p_formula VARCHAR2
) AS

    BEGIN
        UPDATE DRUG
        SET formula = p_formula
        WHERE phcompany = p_phcompany AND trade_name = p_trade_name;
        
        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No drug found with name ' || p_trade_name);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Drug updated: ' || p_trade_name);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: No such pharmaceutical company record found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/

CREATE OR REPLACE PROCEDURE add_pharmacy (
    p_name VARCHAR2, p_address VARCHAR2, p_phone VARCHAR2
) AS

    BEGIN
        INSERT INTO PHARMACY VALUES (p_name, p_address, p_phone);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy added: ' || p_name);
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            DBMS_OUTPUT.PUT_LINE('Error: Pharmacy ' || p_name || ' already exists.');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE delete_pharmacy (
    p_name VARCHAR2, p_address VARCHAR2
) AS

    BEGIN
        DELETE FROM PHARMACY WHERE phname = p_name AND phaddress = p_address;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy deleted: ' || p_name);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: No pharmacy found with name ' || p_name);
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE update_pharmacy (
    p_name VARCHAR2, p_address VARCHAR2, p_phone VARCHAR2
) AS

    BEGIN
        UPDATE PHARMACY
        SET phphone = p_phone
        WHERE phname = p_name AND phaddress = p_address;
        
        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No pharmacy found with name ' || p_name);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Pharmacy updated: ' || p_name);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE add_prescription (
    p_doctor INT, p_patient INT, p_company VARCHAR2, p_drug VARCHAR2,
    p_date DATE, p_quantity INT
) AS

    BEGIN
        -- Delete existing prescription for same doctor and patient
        DELETE FROM PRESCRIPTION
        WHERE doctor = p_doctor AND patient = p_patient;

        -- Insert new prescription
        INSERT INTO PRESCRIPTION (
            doctor, patient, pharma_company, drug_name, prescription_date, quantity
        )
        VALUES (
            p_doctor, p_patient, p_company, p_drug, p_date, p_quantity
        );

        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Prescription added for patient ID: ' || p_patient);
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: Parent record not found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/

CREATE OR REPLACE PROCEDURE add_pharmacy_drug (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2, p_drug VARCHAR2, p_price INT
) AS

    BEGIN
        INSERT INTO PHARMACY_DRUGS VALUES (p_name, p_address, p_company, p_drug, p_price);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy drug added: ' || p_drug);
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: Parent record not found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/

CREATE OR REPLACE PROCEDURE delete_pharmacy_drug (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2, p_drug VARCHAR2
) AS
    BEGIN
        DELETE FROM PHARMACY_DRUGS
        WHERE phaname = p_name AND pha_address = p_address AND
              pharma_company = p_company AND drug_name = p_drug;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy drug deleted: ' || p_drug);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: No pharmacy drug found with name ' || p_drug);
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE update_pharmacy_drug (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2, p_drug VARCHAR2, p_price INT
) AS

    BEGIN
        UPDATE PHARMACY_DRUGS
        SET price = p_price
        WHERE phaname = p_name AND pha_address = p_address AND
              pharma_company = p_company AND drug_name = p_drug;
        
        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No pharmacy drug found with name ' || p_drug);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Pharmacy drug updated: ' || p_drug);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: Parent record not found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/

CREATE OR REPLACE PROCEDURE add_pharmacy_contract (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2,
    p_start DATE, p_end DATE, p_content VARCHAR2, p_supervisor VARCHAR2
) AS

    BEGIN
        INSERT INTO PHARMACY_CONTRACT VALUES (p_name, p_address, p_company, p_start, p_end, p_content, p_supervisor);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy contract added with company: ' || p_company);
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: Parent record not found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/

CREATE OR REPLACE PROCEDURE delete_pharmacy_contract (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2
) AS

    BEGIN
        DELETE FROM PHARMACY_CONTRACT
        WHERE phaname = p_name AND pha_address = p_address AND pharma_company = p_company;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy contract deleted with company: ' || p_company);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: No pharmacy contract found with company ' || p_company);
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE update_pharmacy_contract (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2,
    p_start DATE, p_end DATE, p_content VARCHAR2, p_supervisor VARCHAR2
) AS

    BEGIN
        UPDATE PHARMACY_CONTRACT
        SET start_date = p_start,
            end_date = p_end,
            content = p_content,
            supervisor = p_supervisor
        WHERE phaname = p_name AND pha_address = p_address AND pharma_company = p_company;
        
        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No pharmacy contract found with company ' || p_company);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Pharmacy contract updated with company: ' || p_company);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE = -2291 THEN  -- ORA-02291: integrity constraint (FK) violated
                DBMS_OUTPUT.PUT_LINE('Foreign key violation: Parent record not found.');
            ELSE
                DBMS_OUTPUT.PUT_LINE('Other error: ' || SQLERRM);
            END IF;
    END;

/