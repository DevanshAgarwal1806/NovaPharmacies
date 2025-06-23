# NOVA Pharmacy Chain Database Management System

A comprehensive database management system for NOVA, a chain of pharmacies that manages pharmaceutical companies, drugs, patients, doctors, prescriptions, and contracts.

## 🎯 Project Overview

This project is developed as part of **CSF212 (Database Systems)** course for the 2nd Semester 2024-25. The system manages a chain of pharmacies called "NOVA" that sells drugs produced by different pharmaceutical companies.

### Key Entities Managed:
- **Patients** - Personal details and medical records
- **Doctors** - Professional information and specialties
- **Pharmaceutical Companies** - Drug suppliers and manufacturers
- **Drugs** - Medicine inventory and pricing
- **Pharmacies** - Store locations and management
- **Prescriptions** - Medical prescriptions and drug quantities
- **Contracts** - Business agreements between companies and pharmacies

## ✨ Features

### Core Functionality
- ✅ **Patient Management**: Add, update, delete patient records
- ✅ **Doctor Management**: Manage doctor profiles and specialties
- ✅ **Pharmacy Operations**: Handle multiple pharmacy locations
- ✅ **Drug Inventory**: Track drug stock and pricing across pharmacies
- ✅ **Prescription System**: Create and manage medical prescriptions
- ✅ **Contract Management**: Handle business contracts with supervisors

### Advanced Features
- 📊 **Report Generation**: 
  - Patient prescription history for specific periods
  - Prescription details for given patient and date
  - Drug inventory by pharmaceutical company
  - Pharmacy stock positions
  - Contract details between pharmacy and companies
  - Patient lists for specific doctors

- 🔐 **Data Integrity**: 
  - Referential integrity constraints
  - Business rule enforcement
  - Data validation and error handling

- 🖥️ **Dual Interface**:
  - Modern React.js GUI for user-friendly interaction
  - Command-line SQL/PL-SQL interface for direct database operations

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript framework for building user interfaces
- **HTML5/CSS3** - Structure and styling
- **JavaScript (ES6+)** - Client-side logic

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Primary database management system
- **PL/pgSQL** - Stored procedures and functions
- **SQL** - Database queries and operations

## 🗄️ Database Schema

### Primary Tables
1. **Patients** - `aadhar_id (PK)`, `name`, `address`, `age`
2. **Doctors** - `aadhar_id (PK)`, `name`, `specialty`, `years_of_experience`
3. **Pharmaceutical_Companies** - `name (PK)`, `phone_number`
4. **Drugs** - `trade_name`, `company_name (FK)`, `formula`
5. **Pharmacies** - `pharmacy_id (PK)`, `name`, `address`, `phone`
6. **Prescriptions** - `prescription_id (PK)`, `patient_id (FK)`, `doctor_id (FK)`, `date`, `drugs_prescribed`
7. **Contracts** - `contract_id (PK)`, `pharmacy_id (FK)`, `company_name (FK)`, `start_date`, `end_date`, `supervisor`
8. **Pharmacy_Drugs** - `pharmacy_id (FK)`, `drug_name (FK)`, `company_name (FK)`, `price`

### Key Relationships
- Each patient has a primary physician (Many-to-One)
- Every doctor has at least one patient (One-to-Many)
- Drugs are produced by pharmaceutical companies (Many-to-One)
- Pharmacies sell multiple drugs with varying prices (Many-to-Many)
- Doctors prescribe drugs to patients with date and quantity tracking
