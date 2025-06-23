CREATE OR REPLACE PROCEDURE report_prescriptions(
    patient_id IN NUMBER,
    prescription_start_date IN DATE,
    prescription_end_date IN DATE
) AS
    output_last_date DATE := NULL;
    output_last_doctor VARCHAR2(20) := NULL;
    data_found BOOLEAN := FALSE;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Prescription Report');
    DBMS_OUTPUT.PUT_LINE('===================');

    FOR rec IN (
        SELECT prescription_date, doctor, pharma_company, drug_name, quantity
        FROM PRESCRIPTION
        WHERE patient = patient_id
          AND prescription_date BETWEEN prescription_start_date AND prescription_end_date
        ORDER BY prescription_date, doctor
    ) LOOP
        data_found := TRUE;

        IF output_last_date IS NULL OR output_last_date != rec.prescription_date THEN
            DBMS_OUTPUT.PUT_LINE('Date: ' || rec.prescription_date);
            output_last_date := rec.prescription_date;
            output_last_doctor := NULL;
        END IF;

        IF output_last_doctor IS NULL OR output_last_doctor != rec.doctor THEN
            DBMS_OUTPUT.PUT_LINE(CHR(9) || 'Doctor: ' || rec.doctor);
            output_last_doctor := rec.doctor;
        END IF;

        DBMS_OUTPUT.PUT_LINE(CHR(9) || CHR(9) || 'Pharma Company: ' || rec.pharma_company ||
                             ', Drug: ' || rec.drug_name || 
                             ', Quantity: ' || rec.quantity);
    END LOOP;

    IF NOT data_found THEN
        DBMS_OUTPUT.PUT_LINE('No prescriptions available for the patient');
    END IF;
END;
/