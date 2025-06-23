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

    IF SQL%ROWCOUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: No pharmaceutical company found with name ' || p_name);
    ELSE
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Pharmaceutical company deleted: ' || p_name);
    END IF;
EXCEPTION
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