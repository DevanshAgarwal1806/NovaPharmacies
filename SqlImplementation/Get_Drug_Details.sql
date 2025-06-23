-- pl sql code for getting drug details produced by a pharmaceutical company
--
CREATE OR REPLACE PROCEDURE get_drug_details (
    pharmaceutical_company_name VARCHAR2
) AS 
    data_found BOOLEAN := FALSE;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Details of drugs produced by ' || pharmaceutical_company_name || ':');
    FOR rec IN (
        SELECT trade_name, formula
        FROM DRUG
        WHERE phcompany = pharmaceutical_company_name
    ) LOOP
        data_found := TRUE;
        DBMS_OUTPUT.PUT_LINE('Trade Name: ' || rec.trade_name);
        DBMS_OUTPUT.PUT_LINE('Drug Type: ' || rec.formula);
        DBMS_OUTPUT.PUT_LINE('');
    END LOOP;

    IF NOT data_found THEN
        DBMS_OUTPUT.PUT_LINE('No drugs found for the pharmaceutical company');
    END IF;
END;
/
