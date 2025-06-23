CREATE OR REPLACE PROCEDURE add_prescription (
    p_doctor INT, p_patient INT, p_company VARCHAR2, p_drug VARCHAR2,
    p_date DATE, p_quantity INT
) AS
    prev_date DATE;
BEGIN
    -- Retrieve the latest prescription date for the doctor-patient pair
    SELECT MAX(PRESCRIPTION_DATE) INTO prev_date FROM PRESCRIPTION
    WHERE doctor = p_doctor AND patient = p_patient;

    IF prev_date IS NULL THEN
        -- No existing prescription; insert new
        INSERT INTO PRESCRIPTION (
            doctor, patient, pharma_company, drug_name, prescription_date, quantity
        )
        VALUES (
            p_doctor, p_patient, p_company, p_drug, p_date, p_quantity
        );
        DBMS_OUTPUT.PUT_LINE('Prescription added for patient ID: ' || p_patient);
    ELSIF prev_date < p_date THEN
        -- Newer prescription; delete old and insert new
        DELETE FROM PRESCRIPTION
        WHERE doctor = p_doctor AND patient = p_patient;

        INSERT INTO PRESCRIPTION (
            doctor, patient, pharma_company, drug_name, prescription_date, quantity
        )
        VALUES (
            p_doctor, p_patient, p_company, p_drug, p_date, p_quantity
        );
        DBMS_OUTPUT.PUT_LINE('Prescription updated for patient ID: ' || p_patient);
    ELSIF prev_date = p_date THEN
        -- Same date; insert additional prescription
        INSERT INTO PRESCRIPTION (
            doctor, patient, pharma_company, drug_name, prescription_date, quantity
        )
        VALUES (
            p_doctor, p_patient, p_company, p_drug, p_date, p_quantity
        );
        DBMS_OUTPUT.PUT_LINE('Additional prescription added for patient ID: ' || p_patient);
    ELSE
        -- Existing prescription is more recent
        DBMS_OUTPUT.PUT_LINE('Recent prescription for patient ID: ' || p_patient || ' already exists');
    END IF;

    COMMIT;
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

CREATE OR REPLACE PROCEDURE delete_prescription (
    p_doctor INT, p_patient INT, p_company VARCHAR2, p_drug VARCHAR2
) AS

    BEGIN
        DELETE FROM PRESCRIPTION
        WHERE doctor = p_doctor AND patient = p_patient AND
              pharma_company = p_company AND drug_name = p_drug;

        IF SQL%ROWCOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No prescription found for patient ID ' || p_patient);
        ELSE
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Prescription deleted for patient ID: ' || p_patient);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

/

CREATE OR REPLACE PROCEDURE update_prescription (
    p_doctor INT, p_patient INT, p_company VARCHAR2, p_drug VARCHAR2,
    p_date DATE, p_quantity INT
) AS
num_drugs INT;
curr_date DATE;
    BEGIN
        SELECT prescription_date INTO curr_date
        FROM prescription
        WHERE doctor = p_doctor AND patient = p_patient AND pharma_company = p_company
        AND drug_name = p_drug;

        SELECT COUNT(*) INTO num_drugs
        FROM prescription WHERE doctor = p_doctor AND patient = p_patient;

        IF num_drugs = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Error: No prescription found for patient ID ' || p_patient);
        ELSIF num_drugs = 1 THEN
            UPDATE PRESCRIPTION
            SET prescription_date = p_date,
                quantity = p_quantity
            WHERE doctor = p_doctor AND patient = p_patient AND
                pharma_company = p_company AND drug_name = p_drug;
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Prescription updated for patient ID: ' || p_patient);
        ELSE
            IF curr_date < p_date THEN
                UPDATE PRESCRIPTION
                SET prescription_date = p_date,
                    quantity = p_quantity
                WHERE doctor = p_doctor AND patient = p_patient AND
                    pharma_company = p_company AND drug_name = p_drug; 

                DELETE FROM PRESCRIPTION
                WHERE doctor = p_doctor AND patient = p_patient AND prescription_date = curr_date;
            ELSIF curr_date = p_date THEN
                UPDATE PRESCRIPTION
                SET prescription_date = p_date,
                    quantity = p_quantity
                WHERE doctor = p_doctor AND patient = p_patient AND
                    pharma_company = p_company AND drug_name = p_drug;
            ELSE
                DELETE FROM PRESCRIPTION
                WHERE doctor = p_doctor AND patient = p_patient AND
                    pharma_company = p_company AND drug_name = p_drug;
            END IF;  
            COMMIT;
            DBMS_OUTPUT.PUT_LINE('Prescription updated for patient ID: ' || p_patient);    
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