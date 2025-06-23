CREATE OR REPLACE PROCEDURE pharmacy_drug_stock(
    pharmacy_name IN VARCHAR2,
    pharmacy_address IN VARCHAR2
)AS
    current_company VARCHAR2(20) := NULL;
    cnt NUMBER := 0;
BEGIN
    FOR rec IN (
        SELECT pharma_company, drug_name, price
        FROM PHARMACY_DRUGS
        WHERE phaname = pharmacy_name AND pha_address = pharmacy_address
        ORDER BY pharma_company, drug_name
    ) LOOP
        IF cnt = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Stocks for Pharmacy ' || pharmacy_name || ', located at ' || pharmacy_address);
        END IF;
        cnt := cnt + 1;

        IF current_company IS NULL OR current_company != rec.pharma_company THEN
            DBMS_OUTPUT.PUT_LINE(CHR(5) || 'Pharmaceutical Company: ' || rec.pharma_company);
            current_company := rec.pharma_company;
        END IF;

        DBMS_OUTPUT.PUT_LINE(CHR(9) || '- Drug: ' || rec.drug_name || ', Price: $' || rec.price);
    END LOOP;

    IF cnt = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No stock found for the pharmacy: ' || pharmacy_name || ', Address: ' || pharmacy_address);
    END IF;
END;
/