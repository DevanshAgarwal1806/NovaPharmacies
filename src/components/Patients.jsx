import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import './Patients.css';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({
    paid: '',
    pname: '',
    paddress: '',
    page: '',
    primary_physician: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch patients with their doctor names
      const { data: patientData, error: patientError } = await supabase
        .from('patient')
        .select(`
          paid,
          pname,
          paddress,
          page,
          primary_physician,
          doctor:primary_physician (dname)
        `)
        .order('paid');

      if (patientError) throw patientError;
      
      // Fetch doctors for dropdown
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctor')
        .select('daid, dname')
        .order('dname');

      if (doctorError) throw doctorError;
      
      setPatients(patientData || []);
      setDoctors(doctorData || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setCurrentPatient({
      paid: '',
      pname: '',
      paddress: '',
      page: '',
      primary_physician: ''
    });
    setShowAddModal(true);
  }

  function handleEditClick(patient) {
    setCurrentPatient({
      paid: patient.paid,
      pname: patient.pname,
      paddress: patient.paddress,
      page: patient.page,
      primary_physician: patient.primary_physician
    });
    setShowEditModal(true);
  }

  async function handleDeleteClick(id) {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const { error } = await supabase.rpc('delete_patient', { p_paid: id });

        if (error) throw error;
        setSuccessMessage('Patient deleted successfully');
        fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting patient:', error.message);
        setError('Failed to delete patient');
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCurrentPatient(prev => ({
      ...prev,
      [name]: name === 'paid' || name === 'page' || name === 'primary_physician' 
        ? parseInt(value) || '' 
        : value
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('add_patient', {
        p_paid: currentPatient.paid,
        p_pname: currentPatient.pname,
        p_paddress: currentPatient.paddress,
        p_page: currentPatient.page,
        p_physician: currentPatient.primary_physician
      });

      if (error) throw error;
      setSuccessMessage('Patient added successfully');
      fetchData();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding patient:', error.message);
      setError('Failed to add patient');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('update_patient', {
        p_paid: currentPatient.paid,
        p_pname: currentPatient.pname,
        p_paddress: currentPatient.paddress,
        p_page: currentPatient.page,
        p_physician: currentPatient.primary_physician
      });

      if (error) throw error;
      setSuccessMessage('Patient updated successfully');
      fetchData();
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating patient:', error.message);
      setError('Failed to update patient');
      setTimeout(() => setError(''), 3000);
    }
  }

  if (loading) {
    return <div>Loading patients...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Patients</h1>
          <button onClick={handleAddClick}>Add Patient</button>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <table>
          <thead>
            <tr className="tables">
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Age</th>
              <th>Primary Physician</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6">No patients found</td>
              </tr>
            ) : (
              patients.map(patient => (
                <tr key={patient.paid}>
                  <td>{patient.paid}</td>
                  <td>{patient.pname}</td>
                  <td>{patient.paddress}</td>
                  <td>{patient.page}</td>
                  <td>{patient.doctor ? patient.doctor.dname : 'N/A'}</td>
                  <td>
                    <button onClick={() => handleEditClick(patient)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteClick(patient.paid)}
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

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Patient</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="paid">ID</label>
                <input
                  type="number"
                  id="paid"
                  name="paid"
                  value={currentPatient.paid}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pname">Name</label>
                <input
                  type="text"
                  id="pname"
                  name="pname"
                  value={currentPatient.pname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="paddress">Address</label>
                <input
                  type="text"
                  id="paddress"
                  name="paddress"
                  value={currentPatient.paddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="page">Age</label>
                <input
                  type="number"
                  id="page"
                  name="page"
                  value={currentPatient.page}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="primary_physician">Primary Physician</label>
                <select
                  id="primary_physician"
                  name="primary_physician"
                  value={currentPatient.primary_physician}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.daid} value={doctor.daid}>
                      {doctor.dname}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Add Patient</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Patient</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-paid">ID</label>
                <input
                  type="number"
                  id="edit-paid"
                  name="paid"
                  value={currentPatient.paid}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-pname">Name</label>
                <input
                type="text"
                id="edit-pname"
                name="pname"
                value={currentPatient.pname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-paddress">Address</label>
              <input
                type="text"
                id="edit-paddress"
                name="paddress"
                value={currentPatient.paddress}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-page">Age</label>
              <input
                type="number"
                id="edit-page"
                name="page"
                value={currentPatient.page}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-primary_physician">Primary Physician</label>
              <select
                id="edit-primary_physician"
                name="primary_physician"
                value={currentPatient.primary_physician}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.daid} value={doctor.daid}>
                    {doctor.dname}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Update Patient</button>
          </form>
        </div>
      </div>
    )}
  </div>
);
}

export default Patients;