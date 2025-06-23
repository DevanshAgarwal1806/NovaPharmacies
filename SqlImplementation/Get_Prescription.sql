CREATE OR REPLACE PROCEDURE get_prescription (
    patient_id IN NUMBER,
    presc_date IN DATE
) AS
    cnt NUMBER := 0;
    output_doctor_id NUMBER := NULL;
    BEGIN
        FOR rec IN (
            SELECT doctor, pharma_company, drug_name, quantity
            FROM PRESCRIPTION
            WHERE patient = patient_id AND prescription_date = presc_date
        ) LOOP
            IF cnt = 0 THEN
                DBMS_OUTPUT.PUT_LINE('Prescriptions for Patient ' || patient_id || ' Dated ' || 
                                     presc_date);
            END IF;
            cnt := cnt + 1;
            IF output_doctor_id IS NULL OR output_doctor_id != rec.doctor THEN
                DBMS_OUTPUT.PUT_LINE('Doctor ID: ' || rec.doctor);
                output_doctor_id := rec.doctor;
            END IF;
            DBMS_OUTPUT.PUT_LINE(CHR(9) || 'Pharma Company: ' || rec.pharma_company || 
                                 ', Drug: ' || rec.drug_name || 
                                 ', Quantity: ' || rec.quantity);
        END LOOP;
        IF cnt = 0 THEN
            DBMS_OUTPUT.PUT_LINE('No prescriptions found for the patient ' || patient_id || ' with date ' ||
                                 presc_date);
        END IF;
    END;
/