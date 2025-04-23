import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import './Prescriptions.css';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState({
    prescription_id: null,
    doctor: '',
    patient: '',
    pharmacy_name: '',
    pharmacy_address: '',
    prescription_date: new Date().toISOString().split('T')[0],
    drugs: [{ pharma_company: '', drug_name: '', quantity: 1 }]
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch prescriptions with joined data
      const { data: prescriptionData, error: prescriptionError } = await supabase
        .from('prescription_header')
        .select(`
          prescription_id,
          prescription_date,
          doctor (daid, dname),
          patient (paid, pname),
          pharmacy_name,
          pharmacy_address,
          prescription_detail (pharma_company, drug_name, quantity)
        `)
        .order('prescription_date', { ascending: false });

      if (prescriptionError) throw prescriptionError;
      
      // Fetch doctors
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctor')
        .select('daid, dname, speciality')
        .order('dname');

      if (doctorError) throw doctorError;
      
      // Fetch patients
      const { data: patientData, error: patientError } = await supabase
        .from('patient')
        .select('paid, pname')
        .order('pname');

      if (patientError) throw patientError;
      
      // Fetch drugs with their pharmaceutical companies
      const { data: drugData, error: drugError } = await supabase
        .from('drug')
        .select('phcompany, trade_name')
        .order('trade_name');

      if (drugError) throw drugError;

      // Fetch pharmacies
      const { data: pharmacyData, error: pharmacyError } = await supabase
        .from('pharmacy')
        .select('phname, phaddress')
        .order('phname');

      if (pharmacyError) throw pharmacyError;
      
      setPrescriptions(prescriptionData || []);
      setDoctors(doctorData || []);
      setPatients(patientData || []);
      setDrugs(drugData || []);
      setPharmacies(pharmacyData || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setCurrentPrescription({
      prescription_id: null,
      doctor: '',
      patient: '',
      pharmacy_name: '',
      pharmacy_address: '',
      prescription_date: new Date().toISOString().split('T')[0],
      drugs: [{ pharma_company: '', drug_name: '', quantity: 1 }]
    });
    setShowAddModal(true);
  }

  function handleEditClick(prescription) {
    setCurrentPrescription({
      prescription_id: prescription.prescription_id,
      doctor: prescription.doctor.daid,
      patient: prescription.patient.paid,
      pharmacy_name: prescription.pharmacy_name,
      pharmacy_address: prescription.pharmacy_address,
      prescription_date: prescription.prescription_date,
      drugs: prescription.prescription_detail.map(detail => ({
        pharma_company: detail.pharma_company,
        drug_name: detail.drug_name,
        quantity: detail.quantity
      }))
    });
    setShowEditModal(true);
  }

  async function handleDeleteClick(prescription) {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        const { error } = await supabase.rpc('delete_prescription', {
          p_prescription_id: prescription.prescription_id
        });

        if (error) throw error;
        setSuccessMessage('Prescription deleted successfully');
        fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting prescription:', error.message);
        setError('Failed to delete prescription: ' + error.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCurrentPrescription(prev => ({
      ...prev,
      [name]: name === 'doctor' || name === 'patient' 
        ? parseInt(value) || '' 
        : value
    }));
  }

  function handleDrugChange(index, e) {
    const { name, value } = e.target;
    const updatedDrugs = [...currentPrescription.drugs];
    
    if (name === 'drug') {
      // Parse the combined drug value
      const firstHyphenIndex = value.indexOf('-');
      if (firstHyphenIndex !== -1) {
        const pharma_company = value.substring(0, firstHyphenIndex);
        const drug_name = value.substring(firstHyphenIndex + 1);
        
        updatedDrugs[index] = {
          ...updatedDrugs[index],
          pharma_company,
          drug_name
        };
      } else {
        updatedDrugs[index] = {
          ...updatedDrugs[index],
          pharma_company: '',
          drug_name: ''
        };
      }
    } else if (name === 'quantity') {
      updatedDrugs[index] = {
        ...updatedDrugs[index],
        quantity: parseInt(value) > 0 ? parseInt(value) : 1
      };
    }
    
    setCurrentPrescription(prev => ({
      ...prev,
      drugs: updatedDrugs
    }));
  }

  function handleAddDrug() {
    setCurrentPrescription(prev => ({
      ...prev,
      drugs: [...prev.drugs, { pharma_company: '', drug_name: '', quantity: 1 }]
    }));
  }

  function handleRemoveDrug(index) {
    if (currentPrescription.drugs.length > 1) {
      const updatedDrugs = [...currentPrescription.drugs];
      updatedDrugs.splice(index, 1);
      setCurrentPrescription(prev => ({
        ...prev,
        drugs: updatedDrugs
      }));
    } else {
      setError('Prescription must have at least one drug');
      setTimeout(() => setError(''), 3000);
    }
  }

  function handlePharmacyChange(e) {
    const value = e.target.value;
    if (value) {
      // Find the first occurrence of hyphen to split properly
      const firstHyphenIndex = value.indexOf('-');
      if (firstHyphenIndex !== -1) {
        const pharmacy_name = value.substring(0, firstHyphenIndex);
        const pharmacy_address = value.substring(firstHyphenIndex + 1);
        
        setCurrentPrescription(prev => ({
          ...prev,
          pharmacy_name,
          pharmacy_address
        }));
      }
    } else {
      setCurrentPrescription(prev => ({
        ...prev,
        pharmacy_name: '',
        pharmacy_address: ''
      }));
    }
  }

  function validateForm() {
    if (!currentPrescription.doctor) {
      setError('Please select a doctor');
      return false;
    }
    if (!currentPrescription.patient) {
      setError('Please select a patient');
      return false;
    }
    if (!currentPrescription.pharmacy_name || !currentPrescription.pharmacy_address) {
      setError('Please select a pharmacy');
      return false;
    }
    if (!currentPrescription.prescription_date) {
      setError('Please select a prescription date');
      return false;
    }
    
    // Validate all drugs
    for (let i = 0; i < currentPrescription.drugs.length; i++) {
      const drug = currentPrescription.drugs[i];
      if (!drug.pharma_company || !drug.drug_name) {
        setError(`Please select drug #${i + 1}`);
        return false;
      }
      if (!drug.quantity || drug.quantity <= 0) {
        setError(`Please enter a valid quantity for drug #${i + 1}`);
        return false;
      }
    }
    
    // Check for duplicate drugs
    const drugCombos = currentPrescription.drugs.map(d => `${d.pharma_company}-${d.drug_name}`);
    const uniqueDrugCombos = new Set(drugCombos);
    if (drugCombos.length !== uniqueDrugCombos.size) {
      setError('Duplicate drugs are not allowed in the same prescription');
      return false;
    }
    
    return true;
  }

  async function handleSubmit(e, isEdit) {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      // Prepare drugs data for the JSON parameter
      const drugsJson = currentPrescription.drugs.map(drug => ({
        company: drug.pharma_company,
        name: drug.drug_name,
        quantity: drug.quantity
      }));
      
      // Use RPC to call the PostgreSQL function
      const { data, error } = await supabase.rpc('add_prescription', {
        p_doctor: currentPrescription.doctor,
        p_patient: currentPrescription.patient,
        p_pharmacy_name: currentPrescription.pharmacy_name,
        p_pharmacy_address: currentPrescription.pharmacy_address,
        p_date: currentPrescription.prescription_date,
        p_drugs: drugsJson
      });

      if (error) throw error;
      
      setSuccessMessage(isEdit ? 'Prescription updated successfully' : 'Prescription added successfully');
      fetchData();
      setShowAddModal(false);
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving prescription:', error.message);
      setError('Failed to save prescription: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  }

  if (loading) {
    return <div>Loading prescriptions...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Prescriptions</h1>
          <button onClick={handleAddClick}>Add Prescription</button>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <table>
          <thead>
            <tr className="tables">
              <th>ID</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Pharmacy</th>
              <th>Date</th>
              <th>Drugs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length === 0 ? (
              <tr>
                <td colSpan="7">No prescriptions found</td>
              </tr>
            ) : (
              prescriptions.map((prescription) => (
                <tr key={prescription.prescription_id}>
                  <td>{prescription.prescription_id}</td>
                  <td>{prescription.doctor.dname}</td>
                  <td>{prescription.patient.pname}</td>
                  <td>{prescription.pharmacy_name} {prescription.pharmacy_address && `(${prescription.pharmacy_address})`}</td>
                  <td>{new Date(prescription.prescription_date).toLocaleDateString()}</td>
                  <td>
                    <ul className="drug-list">
                      {prescription.prescription_detail.map((detail, idx) => (
                        <li key={idx}>
                          {detail.drug_name} ({detail.pharma_company}) - Qty: {detail.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="flexbox">
                    <button onClick={() => handleEditClick(prescription)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteClick(prescription)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Prescription Modal - Shared form */}
      {(showAddModal || showEditModal) && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {showAddModal ? 'Add Prescription' : 'Edit Prescription'}
              </h2>
              <button 
                className="close-button" 
                onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={(e) => handleSubmit(e, showEditModal)}>
              <div className="form-group">
                <label htmlFor="doctor">Doctor</label>
                <select
                  id="doctor"
                  name="doctor"
                  value={currentPrescription.doctor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.daid} value={doctor.daid}>
                      {doctor.dname} ({doctor.speciality})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="patient">Patient</label>
                <select
                  id="patient"
                  name="patient"
                  value={currentPrescription.patient}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.paid} value={patient.paid}>
                      {patient.pname}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="pharmacy">Pharmacy</label>
                <select
                  id="pharmacy"
                  name="pharmacy"
                  value={`${currentPrescription.pharmacy_name}-${currentPrescription.pharmacy_address}`}
                  onChange={handlePharmacyChange}
                  required
                >
                  <option value="">Select a pharmacy</option>
                  {pharmacies.map((pharmacy, index) => (
                    <option key={index} value={`${pharmacy.phname}-${pharmacy.phaddress}`}>
                      {pharmacy.phname} ({pharmacy.phaddress})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="prescription_date">Prescription Date</label>
                <input
                  type="date"
                  id="prescription_date"
                  name="prescription_date"
                  value={currentPrescription.prescription_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group drugs-section">
                <label>Prescribed Drugs</label>
                {currentPrescription.drugs.map((drug, index) => (
                  <div key={index} className="drug-item">
                    <div className="drug-row">
                      <select
                        name="drug"
                        value={`${drug.pharma_company}-${drug.drug_name}`}
                        onChange={(e) => handleDrugChange(index, e)}
                        required
                      >
                        <option value="">Select a drug</option>
                        {drugs.map((drugOption, idx) => (
                          <option key={idx} value={`${drugOption.phcompany}-${drugOption.trade_name}`}>
                            {drugOption.trade_name} ({drugOption.phcompany})
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        name="quantity"
                        placeholder="Qty"
                        value={drug.quantity}
                        onChange={(e) => handleDrugChange(index, e)}
                        min="1"
                        required
                      />
                      
                      <button
                        type="button"
                        className="remove-drug"
                        onClick={() => handleRemoveDrug(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <button type="button" className="add-drug" onClick={handleAddDrug}>
                  + Add Another Drug
                </button>
              </div>
              
              <button type="submit">
                {showAddModal ? 'Add Prescription' : 'Update Prescription'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prescriptions;