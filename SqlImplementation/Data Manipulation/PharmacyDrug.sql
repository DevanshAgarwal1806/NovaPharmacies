CREATE OR REPLACE PROCEDURE add_pharmacy_drug (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2, p_drug VARCHAR2, p_price INT
) AS

    BEGIN
        INSERT INTO PHARMACY_DRUGS VALUES (p_name, p_address, p_company, p_drug, p_price);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy drug added: ' || p_drug);
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            DBMS_OUTPUT.PUT_LINE('Same record exists');
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

    IF SQL%ROWCOUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: No pharmacy drug found with name ' || p_drug || 
                             ' at pharmacy ' || p_name || ', ' || p_address);
    ELSE
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy drug deleted: ' || p_drug);
    END IF;
EXCEPTION
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