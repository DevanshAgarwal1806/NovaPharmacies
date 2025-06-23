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

    IF SQL%ROWCOUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: No drug found with name ' || p_trade_name);
    ELSE
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Drug deleted: ' || p_trade_name);
    END IF;
EXCEPTION
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

CREATE OR REPLACE TRIGGER drug_updated
AFTER UPDATE OF phcompany, trade_name
ON DRUG
FOR EACH ROW
BEGIN
    UPDATE prescription
    SET pharma_company = :NEW.phcompany, drug_name = :NEW.trade_name
    WHERE pharma_company = :OLD.phcompany AND drug_name = :OLD.trade_name;

    IF SQL%ROWCOUNT > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Prescription table updated');
    END IF;

    UPDATE pharmacy_drugs
    SET pharma_company = :NEW.phcompany, drug_name = :NEW.trade_name
    WHERE pharma_company = :OLD.phcompany AND drug_name = :OLD.trade_name;

    IF SQL%ROWCOUNT > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Pharmacy_drug table updated');
    END IF;
END;
/