import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import Doctors from './components/Doctors';
import Patients from './components/Patients';
import PharmaceuticalCompanies from './components/PharmaceuticalCompanies';
import Drugs from './components/Drugs';
import Pharmacy from './components/Pharmacy';
import Prescriptions from './components/Prescriptions';
import PharmacyDrugs from './components/PharmacyDrugs';
import PharmacyContracts from './components/PharmacyContracts';

// Initialize Supabase client
const supabaseUrl = 'https://diiovqxucnpfgjfhdvca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaW92cXh1Y25wZmdqZmhkdmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjY4ODEsImV4cCI6MjA2MDkwMjg4MX0.uG3R2KXLE0llb3-mhxULr1PSKpUrUwuSKyxNvDBHoiU';
export const supabase = createClient(supabaseUrl, supabaseKey);



function App() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };
  
  const closeMenu = () => {
    setIsMenuActive(false);
  };
    return (
      <Router>
        <div className="app">
        <nav className="navbar">
      <div className="navbar-brand">Healthcare Management System</div>
      
      <div className={`hamburger ${isMenuActive ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <ul className={`navbar-nav ${isMenuActive ? 'active' : ''}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={closeMenu}>Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/doctors" className="nav-link" onClick={closeMenu}>Doctors</Link>
        </li>
        <li className="nav-item">
          <Link to="/patients" className="nav-link" onClick={closeMenu}>Patients</Link>
        </li>
        <li className="nav-item">
          <Link to="/pharmaceutical-companies" className="nav-link" onClick={closeMenu}>Pharmaceutical Companies</Link>
        </li>
        <li className="nav-item">
          <Link to="/drugs" className="nav-link" onClick={closeMenu}>Drugs</Link>
        </li>
        <li className="nav-item">
          <Link to="/pharmacy" className="nav-link" onClick={closeMenu}>Pharmacies</Link>
        </li>
        <li className="nav-item">
          <Link to="/prescriptions" className="nav-link" onClick={closeMenu}>Prescriptions</Link>
        </li>
        <li className="nav-item">
          <Link to="/pharmacy-drugs" className="nav-link" onClick={closeMenu}>Pharmacy Drugs</Link>
        </li>
        <li className="nav-item">
          <Link to="/pharmacy-contracts" className="nav-link" onClick={closeMenu}>Pharmacy Contracts</Link>
        </li>
      </ul>
    </nav>
          <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/pharmaceutical-companies" element={<PharmaceuticalCompanies />} />
            <Route path="/drugs" element={<Drugs />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/pharmacy-drugs" element={<PharmacyDrugs />} />
            <Route path="/pharmacy-contracts" element={<PharmacyContracts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
