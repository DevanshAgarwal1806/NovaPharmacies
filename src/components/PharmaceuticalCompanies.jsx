import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import './PharmaceuticalCompanies.css';

function PharmaceuticalCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDrugsModal, setShowDrugsModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({
    phcname: '',
    phcphone: ''
  });
  const [companyDrugs, setCompanyDrugs] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pharmaceutical_company')
        .select('*')
        .order('phcname');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error.message);
      setError('Failed to fetch pharmaceutical companies');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCompanyDrugs(companyName) {
    try {
      const { data, error } = await supabase
        .from('drug')
        .select('trade_name, formula')
        .eq('phcompany', companyName)
        .order('trade_name');

      if (error) throw error;
      setCompanyDrugs(data || []);
      setSelectedCompany(companyName);
      setShowDrugsModal(true);
    } catch (error) {
      console.error('Error fetching drugs:', error.message);
      setError('Failed to fetch drugs for this company');
      setTimeout(() => setError(''), 3000);
    }
  }

  function handleAddClick() {
    setCurrentCompany({
      phcname: '',
      phcphone: ''
    });
    setShowAddModal(true);
  }

  function handleEditClick(company) {
    setCurrentCompany({
      phcname: company.phcname,
      phcphone: company.phcphone
    });
    setShowEditModal(true);
  }

  function handleViewDrugsClick(company) {
    fetchCompanyDrugs(company.phcname);
  }

  async function handleDeleteClick(name) {
    if (window.confirm('Are you sure you want to delete this pharmaceutical company?')) {
      try {
        const { error } = await supabase.rpc('delete_pharmaceutical_company', {
          p_name: name
        });

        if (error) throw error;
        setSuccessMessage('Company deleted successfully');
        fetchCompanies();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting company:', error.message);
        setError('Failed to delete company');
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCurrentCompany(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('add_pharmaceutical_company', {
        p_name: currentCompany.phcname,
        p_phone: currentCompany.phcphone
      });

      if (error) throw error;
      setSuccessMessage('Company added successfully');
      fetchCompanies();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding company:', error.message);
      setError('Failed to add company');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('update_pharmaceutical_company', {
        p_name: currentCompany.phcname,
        p_phone: currentCompany.phcphone
      });

      if (error) throw error;
      setSuccessMessage('Company updated successfully');
      fetchCompanies();
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating company:', error.message);
      setError('Failed to update company');
      setTimeout(() => setError(''), 3000);
    }
  }

  if (loading) {
    return <div>Loading pharmaceutical companies...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Pharmaceutical Companies</h1>
          <button onClick={handleAddClick}>Add Company</button>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="3">No pharmaceutical companies found</td>
              </tr>
            ) : (
              companies.map(company => (
                <tr key={company.phcname}>
                  <td>{company.phcname}</td>
                  <td>{company.phcphone}</td>
                  <td>
                    <button onClick={() => handleViewDrugsClick(company)}>View Drugs</button>
                    <button onClick={() => handleEditClick(company)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteClick(company.phcname)}
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

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Pharmaceutical Company</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="phcname">Company Name</label>
                <input
                  type="text"
                  id="phcname"
                  name="phcname"
                  value={currentCompany.phcname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phcphone">Phone</label>
                <input
                  type="text"
                  id="phcphone"
                  name="phcphone"
                  value={currentCompany.phcphone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Add Company</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Pharmaceutical Company</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-phcname">Company Name</label>
                <input
                  type="text"
                  id="edit-phcname"
                  name="phcname"
                  value={currentCompany.phcname}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-phcphone">Phone</label>
                <input
                  type="text"
                  id="edit-phcphone"
                  name="phcphone"
                  value={currentCompany.phcphone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Update Company</button>
            </form>
          </div>
        </div>
      )}

      {/* View Drugs Modal */}
      {showDrugsModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Drugs by {selectedCompany}</h2>
              <button className="close-button" onClick={() => setShowDrugsModal(false)}>&times;</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Trade Name</th>
                  <th>Formula</th>
                </tr>
              </thead>
              <tbody>
                {companyDrugs.length === 0 ? (
                  <tr>
                    <td colSpan="2">No drugs found for this company</td>
                  </tr>
                ) : (
                  companyDrugs.map((drug, index) => (
                    <tr key={index}>
                      <td>{drug.trade_name}</td>
                      <td>{drug.formula}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PharmaceuticalCompanies;