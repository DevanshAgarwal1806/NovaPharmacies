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

    IF SQL%ROWCOUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: No patient found with ID ' || p_paid);
    ELSE
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Patient deleted with ID: ' || p_paid);
    END IF;
EXCEPTION
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



