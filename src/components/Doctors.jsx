import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import './Doctors.css';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState({
    daid: '',
    dname: '',
    speciality: '',
    years_of_experience: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctor')
        .select('*')
        .order('daid');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error.message);
      setError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setCurrentDoctor({
      daid: '',
      dname: '',
      speciality: '',
      years_of_experience: ''
    });
    setShowAddModal(true);
  }

  function handleEditClick(doctor) {
    setCurrentDoctor({
      daid: doctor.daid,
      dname: doctor.dname,
      speciality: doctor.speciality,
      years_of_experience: doctor.years_of_experience
    });
    setShowEditModal(true);
  }

  async function handleDeleteClick(id) {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        const { error } = await supabase
          .from('doctor')
          .delete()
          .eq('daid', id);

        if (error) throw error;
        setSuccessMessage('Doctor deleted successfully');
        fetchDoctors();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting doctor:', error.message);
        setError('Failed to delete doctor');
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCurrentDoctor(prev => ({
      ...prev,
      [name]: name === 'daid' || name === 'years_of_experience' ? parseInt(value) || '' : value
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    try {
      // Using the stored procedure through Supabase's RPC
      const { error } = await supabase.rpc('add_doctor', {
        p_daid: currentDoctor.daid,
        p_dname: currentDoctor.dname,
        p_speciality: currentDoctor.speciality,
        p_years_of_experience: currentDoctor.years_of_experience
      });

      if (error) throw error;
      setSuccessMessage('Doctor added successfully');
      fetchDoctors();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding doctor:', error.message);
      setError('Failed to add doctor');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      // Using the stored procedure through Supabase's RPC
      const { error } = await supabase.rpc('update_doctor', {
        p_daid: currentDoctor.daid,
        p_dname: currentDoctor.dname,
        p_speciality: currentDoctor.speciality,
        p_years_of_experience: currentDoctor.years_of_experience
      });

      if (error) throw error;
      setSuccessMessage('Doctor updated successfully');
      fetchDoctors();
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating doctor:', error.message);
      setError('Failed to update doctor');
      setTimeout(() => setError(''), 3000);
    }
  }

  if (loading) {
    return <div>Loading doctors...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Doctors</h1>
          <button onClick={handleAddClick}>Add Doctor</button>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <table>
          <thead>
            <tr className="tables">
              <th>ID</th>
              <th>Name</th>
              <th>Speciality</th>
              <th>Years of Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="5">No doctors found</td>
              </tr>
            ) : (
              doctors.map(doctor => (
                <tr key={doctor.daid} className="tables">
                  <td>{doctor.daid}</td>
                  <td>{doctor.dname}</td>
                  <td>{doctor.speciality}</td>
                  <td>{doctor.years_of_experience}</td>
                  <td>
                    <button onClick={() => handleEditClick(doctor)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteClick(doctor.daid)}
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

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Doctor</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="daid">ID</label>
                <input
                  type="number"
                  id="daid"
                  name="daid"
                  value={currentDoctor.daid}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dname">Name</label>
                <input
                  type="text"
                  id="dname"
                  name="dname"
                  value={currentDoctor.dname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="speciality">Speciality</label>
                <input
                  type="text"
                  id="speciality"
                  name="speciality"
                  value={currentDoctor.speciality}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="years_of_experience">Years of Experience</label>
                <input
                  type="number"
                  id="years_of_experience"
                  name="years_of_experience"
                  value={currentDoctor.years_of_experience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Add Doctor</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Doctor</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-daid">ID</label>
                <input
                  type="number"
                  id="edit-daid"
                  name="daid"
                  value={currentDoctor.daid}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-dname">Name</label>
                <input
                  type="text"
                  id="edit-dname"
                  name="dname"
                  value={currentDoctor.dname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-speciality">Speciality</label>
                <input
                  type="text"
                  id="edit-speciality"
                  name="speciality"
                  value={currentDoctor.speciality}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-years_of_experience">Years of Experience</label>
                <input
                  type="number"
                  id="edit-years_of_experience"
                  name="years_of_experience"
                  value={currentDoctor.years_of_experience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Update Doctor</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
