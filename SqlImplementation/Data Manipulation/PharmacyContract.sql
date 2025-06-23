CREATE OR REPLACE PROCEDURE add_pharmacy_contract (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2,
    p_start DATE, p_end DATE, p_content VARCHAR2, p_supervisor VARCHAR2
) AS

    BEGIN
        INSERT INTO PHARMACY_CONTRACT VALUES (p_name, p_address, p_company, p_start, p_end, p_content, p_supervisor);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy contract added with company: ' || p_company);
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

CREATE OR REPLACE PROCEDURE delete_pharmacy_contract (
    p_name VARCHAR2, p_address VARCHAR2, p_company VARCHAR2
) AS
BEGIN
    DELETE FROM PHARMACY_CONTRACT
    WHERE phaname = p_name AND pha_address = p_address AND pharma_company = p_company;

    IF SQL%ROWCOUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: No pharmacy contract found with company ' || p_company || ' at ' || p_name || ', ' || p_address);
    ELSE
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy contract deleted with company: ' || p_company);
    END IF;
EXCEPTION
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