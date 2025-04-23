import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import './Drugs.css';
function Drugs() {
  const [drugs, setDrugs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDrug, setCurrentDrug] = useState({
    phcompany: '',
    trade_name: '',
    formula: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch drugs with company details
      const { data: drugData, error: drugError } = await supabase
        .from('drug')
        .select(`
          phcompany,
          trade_name,
          formula,
          pharmaceutical_company:phcompany (phcname, phcphone)
        `)
        .order('trade_name');

      if (drugError) throw drugError;
      
      // Fetch pharmaceutical companies for dropdown
      const { data: companyData, error: companyError } = await supabase
        .from('pharmaceutical_company')
        .select('phcname')
        .order('phcname');

      if (companyError) throw companyError;
      
      setDrugs(drugData || []);
      setCompanies(companyData || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setCurrentDrug({
      phcompany: '',
      trade_name: '',
      formula: ''
    });
    setShowAddModal(true);
  }

  function handleEditClick(drug) {
    setCurrentDrug({
      phcompany: drug.phcompany,
      trade_name: drug.trade_name,
      formula: drug.formula
    });
    setShowEditModal(true);
  }

  async function handleDeleteClick(company, tradeName) {
    if (window.confirm('Are you sure you want to delete this drug?')) {
      try {
        const { error } = await supabase.rpc('delete_drug', {
          p_phcompany: company,
          p_trade_name: tradeName
        });

        if (error) throw error;
        setSuccessMessage('Drug deleted successfully');
        fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting drug:', error.message);
        setError('Failed to delete drug');
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCurrentDrug(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('add_drug', {
        p_phcompany: currentDrug.phcompany,
        p_trade_name: currentDrug.trade_name,
        p_formula: currentDrug.formula
      });

      if (error) throw error;
      setSuccessMessage('Drug added successfully');
      fetchData();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding drug:', error.message);
      setError('Failed to add drug');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('update_drug', {
        p_phcompany: currentDrug.phcompany,
        p_trade_name: currentDrug.trade_name,
        p_formula: currentDrug.formula
      });

      if (error) throw error;
      setSuccessMessage('Drug updated successfully');
      fetchData();
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating drug:', error.message);
      setError('Failed to update drug');
      setTimeout(() => setError(''), 3000);
    }
  }

  if (loading) {
    return <div>Loading drugs...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Drugs</h1>
          <button onClick={handleAddClick}>Add Drug</button>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <table>
          <thead>
            <tr>
              <th>Trade Name</th>
              <th>Pharmaceutical Company</th>
              <th>Formula</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drugs.length === 0 ? (
              <tr>
                <td colSpan="4">No drugs found</td>
              </tr>
            ) : (
              drugs.map((drug, index) => (
                <tr key={index}>
                  <td>{drug.trade_name}</td>
                  <td>{drug.phcompany}</td>
                  <td>{drug.formula}</td>
                  <td>
                    <button onClick={() => handleEditClick(drug)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteClick(drug.phcompany, drug.trade_name)}
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

      {/* Add Drug Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Drug</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="phcompany">Pharmaceutical Company</label>
                <select
                  id="phcompany"
                  name="phcompany"
                  value={currentDrug.phcompany}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((company, index) => (
                    <option key={index} value={company.phcname}>
                      {company.phcname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="trade_name">Trade Name</label>
                <input
                  type="text"
                  id="trade_name"
                  name="trade_name"
                  value={currentDrug.trade_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="formula">Formula</label>
                <input
                  type="text"
                  id="formula"
                  name="formula"
                  value={currentDrug.formula}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Add Drug</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Drug Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Drug</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-phcompany">Pharmaceutical Company</label>
                <input
                  type="text"
                  id="edit-phcompany"
                  name="phcompany"
                  value={currentDrug.phcompany}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-trade_name">Trade Name</label>
                <input
                  type="text"
                  id="edit-trade_name"
                  name="trade_name"
                  value={currentDrug.trade_name}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-formula">Formula</label>
                <input
                  type="text"
                  id="edit-formula"
                  name="formula"
                  value={currentDrug.formula}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Update Drug</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Drugs;