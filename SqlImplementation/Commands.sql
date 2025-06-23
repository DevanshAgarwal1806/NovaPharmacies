-- 2. Generate a report on prescriptions of a patient in a given period. (Duration needs to be specified)
-- exec report_prescriptions(102, TO_DATE('01-04-2025', 'DD-MM-YYYY'), TO_DATE('05-04-2025', 'DD-MM-YYYY'));

-- 3. Print prescription for given patient for a given date. (Prescription Table)
-- exec get_prescription(101, TO_DATE('01-04-2025', 'DD-MM-YYYY'));

-- 4. Get the details of drugs produced by a pharmaceutical company. (DRUG Table)
-- exec get_drug_details('MediCure');

-- 5. Print the stock position of a pharmacy. (Drugs in the pharmacy; PHARMACY_DRUGS Table)
-- exec pharmacy_drug_stock('CityPharma', 'Downtown Street');

-- 6. Print the contract details of a pharmacy-pharmaceutical company. (PHARMACY_CONTRACT Table)
-- exec pharmacy_company_contract('CityPharma', 'Downtown Street', 'MediCure');

-- 7. Print the list of patients for a given doctor (Prescription Table)
-- exec get_patients_list(1);

--1.Doctor 
--EXEC add_doctor(101, 'Dr. Ayesha Khan', 'Cardiology', 10);
--EXEC delete_doctor(101);
--EXEC update_doctor(101, 'Dr. Ayesha Khan', 'Neurology', 12);

--2.Drug
-- EXEC add_drug('Pfizer', 'Paracet', 'C8H9NO2');

-- EXEC delete_drug('Pfizer', 'Paracet');

-- EXEC update_drug('Pfizer', 'Paracet', 'C8H9NO2 + Caffeine');

--3.Patient
--EXEC add_patient(1001, 'John Doe', 'New Town', 30, 200);
--EXEC delete_patient(1001);
--EXEC update_patient(1001, 'Jane Smith', 'Old City', 40, 200);

--4.Pharmaceutical Company
--EXEC add_pharmaceutical_company('MediCorp', '1234567890');
--EXEC delete_pharmaceutical_company('MediCorp');
--EXEC update_pharmaceutical_company('MediCorp', '9876543210');

--5.Pharmacy 
--EXEC add_pharmacy('HealthCare Pharmacy', '123 Wellness St', '555-1234');
--EXEC delete_pharmacy('HealthCare Pharmacy', '123 Wellness St');
--EXEC update_pharmacy('HealthCare Pharmacy', '123 Wellness St', '555-4321');

--6.PharmacyContract
--EXEC add_pharmacy_contract('HealthCare Pharmacy', '123 Wellness St', 'HealthCo Pharma', TO_DATE('2025-01-01', 'YYYY-MM-DD'), TO_DATE('2025-12-31', 'YYYY-MM-DD'), 'Supply Agreement', 'Dr. Smith');

--EXEC delete_pharmacy_contract('HealthCare Pharmacy', '123 Wellness St', 'HealthCo Pharma');
--EXEC update_pharmacy_contract('HealthCare Pharmacy', '123 Wellness St', 'HealthCo Pharma', TO_DATE('2025-01-01', 'YYYY-MM-DD'), TO_DATE('2026-12-31', 'YYYY-MM-DD'), 'Updated Supply Agreement', 'Dr. Johnson');

--7.Pharmacy Drug
--EXEC add_pharmacy_drug('HealthCare Pharmacy', '123 Wellness St', 'HealthCo Pharma', 'Aspirin', 50);
--EXEC delete_pharmacy_drug('HealthCare Pharmacy', '123 Wellness St', 'HealthCo Pharma', 'Aspirin');
--EXEC update_pharmacy_drug('HealthCare Pharmacy', '123 Wellness St', 'HealthCo Pharma', 'Aspirin', 55);

--8.Prescription
--EXEC add_prescription(101, 202, 'HealthCo Pharma', 'Aspirin', TO_DATE('2025-04-24', 'YYYY-MM-DD'), 30);
--EXEC delete_prescription(101, 202, 'HealthCo Pharma', 'Aspirin');
--EXEC update_prescription(101, 202, 'HealthCo Pharma', 'Aspirin', TO_DATE('2025-04-25', 'YYYY-MM-DD'), 60);
