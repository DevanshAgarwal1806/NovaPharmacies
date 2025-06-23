CREATE OR REPLACE PROCEDURE pharmacy_company_contract(
    pharmacy_name IN VARCHAR2,
    pharmacy_address IN VARCHAR2,
    pharmaceutical_company_name IN VARCHAR2
) AS
    data_found BOOLEAN := FALSE;
BEGIN
    FOR rec IN(
        SELECT start_date , end_date , content ,supervisor
        FROM PHARMACY_CONTRACT
        WHERE phaname = pharmacy_name and pha_address = pharmacy_address and pharma_company = pharmaceutical_company_name
    ) LOOP
        data_found := TRUE;
        DBMS_OUTPUT.PUT_LINE('Details of the contract between pharmacy "' || pharmacy_name || '", located at "' || pharmacy_address || '", and pharmaceutical company "' || pharmaceutical_company_name || '":');
        DBMS_OUTPUT.PUT_LINE('Start Date : ' || rec.start_date);
        DBMS_OUTPUT.PUT_LINE('End Date : ' || rec.end_date);
        DBMS_OUTPUT.PUT_LINE('Contract Content : ' || rec.content);
        DBMS_OUTPUT.PUT_LINE('Supervisor : ' || rec.supervisor);
    END LOOP;

    IF NOT data_found THEN
        DBMS_OUTPUT.PUT_LINE('No contract details found for the pharmacy and pharmaceutical company.');
    END IF;
END;
/