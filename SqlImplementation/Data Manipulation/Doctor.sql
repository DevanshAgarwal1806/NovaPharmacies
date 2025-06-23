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
        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No doctor found with ID ' || p_daid);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Doctor deleted with ID: ' || p_daid);
        END IF;
    EXCEPTION
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

CREATE OR REPLACE TRIGGER doctor_updated
AFTER UPDATE OF daid
ON DOCTOR
FOR EACH ROW
BEGIN
    UPDATE PATIENT
    SET primary_physician = :NEW.daid
    WHERE primary_physician = :OLD.daid;

    IF SQL%ROWCOUNT > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Patient table updated');
    END IF;

    UPDATE PRESCRIPTION
    SET doctor = :NEW.daid
    WHERE doctor = :OLD.daid;

    IF SQL%ROWCOUNT > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Prescription table updated');
    END IF;
END;
/

