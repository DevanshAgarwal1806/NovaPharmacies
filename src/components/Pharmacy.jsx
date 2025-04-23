import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import './Pharmacy.css';

function Pharmacy() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPharmacy, setCurrentPharmacy] = useState({
    phname: '',
    phaddress: '',
    phphone: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPharmacies();
  }, []);

  async function fetchPharmacies() {
    try {
      setLoading(true);
      
      // Fetch pharmacies
      const { data, error } = await supabase
        .from('pharmacy')
        .select('*')
        .order('phname');

      if (error) throw error;
      
      setPharmacies(data || []);
    } catch (error) {
      console.error('Error fetching pharmacies:', error.message);
      setError('Failed to fetch pharmacies');
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setCurrentPharmacy({
      phname: '',
      phaddress: '',
      phphone: ''
    });
    setShowAddModal(true);
  }

  function handleEditClick(pharmacy) {
    setCurrentPharmacy({
      phname: pharmacy.phname,
      phaddress: pharmacy.phaddress,
      phphone: pharmacy.phphone
    });
    setShowEditModal(true);
  }

  async function handleDeleteClick(name, address) {
    if (window.confirm('Are you sure you want to delete this pharmacy?')) {
      try {
        const { error } = await supabase.rpc('delete_pharmacy', {
          p_name: name,
          p_address: address
        });

        if (error) throw error;
        setSuccessMessage('Pharmacy deleted successfully');
        fetchPharmacies();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting pharmacy:', error.message);
        setError('Failed to delete pharmacy');
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCurrentPharmacy(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('add_pharmacy', {
        p_name: currentPharmacy.phname,
        p_address: currentPharmacy.phaddress,
        p_phone: currentPharmacy.phphone
      });

      if (error) throw error;
      setSuccessMessage('Pharmacy added successfully');
      fetchPharmacies();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding pharmacy:', error.message);
      setError('Failed to add pharmacy');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('update_pharmacy', {
        p_name: currentPharmacy.phname,
        p_address: currentPharmacy.phaddress,
        p_phone: currentPharmacy.phphone
      });

      if (error) throw error;
      setSuccessMessage('Pharmacy updated successfully');
      fetchPharmacies();
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating pharmacy:', error.message);
      setError('Failed to update pharmacy');
      setTimeout(() => setError(''), 3000);
    }
  }

  if (loading) {
    return <div>Loading pharmacies...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Pharmacies</h1>
          <button onClick={handleAddClick}>Add Pharmacy</button>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.length === 0 ? (
              <tr>
                <td colSpan="4">No pharmacies found</td>
              </tr>
            ) : (
              pharmacies.map((pharmacy, index) => (
                <tr key={index}>
                  <td>{pharmacy.phname}</td>
                  <td>{pharmacy.phaddress}</td>
                  <td>{pharmacy.phphone}</td>
                  <td>
                    <button onClick={() => handleEditClick(pharmacy)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteClick(pharmacy.phname, pharmacy.phaddress)}
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

      {/* Add Pharmacy Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Pharmacy</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="phname">Pharmacy Name</label>
                <input
                  type="text"
                  id="phname"
                  name="phname"
                  value={currentPharmacy.phname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phaddress">Address</label>
                <input
                  type="text"
                  id="phaddress"
                  name="phaddress"
                  value={currentPharmacy.phaddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phphone">Phone</label>
                <input
                  type="text"
                  id="phphone"
                  name="phphone"
                  value={currentPharmacy.phphone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Add Pharmacy</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pharmacy Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Pharmacy</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-phname">Pharmacy Name</label>
                <input
                  type="text"
                  id="edit-phname"
                  name="phname"
                  value={currentPharmacy.phname}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-phaddress">Address</label>
                <input
                  type="text"
                  id="edit-phaddress"
                  name="phaddress"
                  value={currentPharmacy.phaddress}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-phphone">Phone</label>
                <input
                  type="text"
                  id="edit-phphone"
                  name="phphone"
                  value={currentPharmacy.phphone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Update Pharmacy</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pharmacy;