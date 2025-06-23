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

    IF SQL%ROWCOUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: No pharmacy found with name ' || p_name || ' at address ' || p_address);
    ELSE
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmacy deleted: ' || p_name);
    END IF;
EXCEPTION
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