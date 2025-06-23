--Patients of particular doctors
CREATE OR REPLACE PROCEDURE get_patients_list
(
    p_doctor_id IN NUMBER
)
AS
found_flag BOOLEAN := FALSE;
BEGIN 
    FOR patient in (
        SELECT DISTINCT p.paid, p.pname, p.paddress, p.page
        FROM PRESCRIPTION PR
        JOIN PATIENT P ON PR.patient = P.paid
        WHERE PR.doctor=p_doctor_id
    ) LOOP
        DBMS_OUTPUT.PUT_LINE('Patient Aadhar ID   : ' || patient.paid);
        DBMS_OUTPUT.PUT_LINE('Patient Name        : ' || patient.pname);
        DBMS_OUTPUT.PUT_LINE('Address      : ' || patient.paddress);
        DBMS_OUTPUT.PUT_LINE('Age          : ' || patient.page);
        DBMS_OUTPUT.PUT_LINE('-------------------------------');

        found_flag := TRUE;
    END LOOP;
    IF NOT found_flag THEN
        DBMS_OUTPUT.PUT_LINE('No patients found for the given doctor ID.');
    END IF;
    EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
END;
/