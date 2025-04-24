import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import './PharmacyContracts.css';

function PharmacyContract() {
  const [contracts, setContracts] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentContract, setCurrentContract] = useState({
    phaname: '',
    pha_address: '',
    pharma_company: '',
    start_date: '',
    end_date: '',
    content: '',
    supervisor: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch pharmacy contracts directly without trying to use relationships
      const { data: contractData, error: contractError } = await supabase
        .from('pharmacy_contract')
        .select('*')
        .order('phaname');

      if (contractError) throw contractError;
      
      // Fetch pharmacies for dropdown
      const { data: pharmacyData, error: pharmacyError } = await supabase
        .from('pharmacy')
        .select('phname, phaddress')
        .order('phname');

      if (pharmacyError) throw pharmacyError;
      
      // Fetch pharmaceutical companies for dropdown
      const { data: companyData, error: companyError } = await supabase
        .from('pharmaceutical_company')
        .select('phcname')
        .order('phcname');

      if (companyError) throw companyError;
      
      // Now separately fetch pharmacy names and company names for display purposes
      if (contractData && contractData.length > 0) {
        // Create arrays of unique pharmacy keys and company names
        const pharmacyKeys = [...new Set(contractData.map(contract => 
          `${contract.phaname}|${contract.pha_address}`))];
        
        const companyNames = [...new Set(contractData.map(contract => 
          contract.pharma_company))];
        
        // Fetch full pharmacy information if needed
        if (pharmacyKeys.length > 0) {
          const pharmacyQueries = pharmacyKeys.map(key => {
            const [name, address] = key.split('|');
            return supabase
              .from('pharmacy')
              .select('phname, phaddress, phphone')
              .eq('phname', name)
              .eq('phaddress', address)
              .single();
          });
          
          const pharmacyResults = await Promise.all(pharmacyQueries);
          const pharmacyLookup = {};
          
          pharmacyResults.forEach(result => {
            if (!result.error && result.data) {
              const key = `${result.data.phname}|${result.data.phaddress}`;
              pharmacyLookup[key] = result.data;
            }
          });
          
          // Enhance contract data with pharmacy information
          const enhancedContracts = contractData.map(contract => {
            const key = `${contract.phaname}|${contract.pha_address}`;
            return {
              ...contract,
              pharmacy: pharmacyLookup[key] || null
            };
          });
          
          setContracts(enhancedContracts);
        } else {
          setContracts(contractData);
        }
      } else {
        setContracts([]);
      }
      
      setPharmacies(pharmacyData || []);
      setCompanies(companyData || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setCurrentContract({
      phaname: '',
      pha_address: '',
      pharma_company: '',
      start_date: '',
      end_date: '',
      content: '',
      supervisor: ''
    });
    setShowAddModal(true);
  }

  function handleEditClick(contract) {
    setCurrentContract({
      phaname: contract.phaname,
      pha_address: contract.pha_address,
      pharma_company: contract.pharma_company,
      start_date: contract.start_date ? contract.start_date.substring(0, 10) : '',
      end_date: contract.end_date ? contract.end_date.substring(0, 10) : '',
      content: contract.content,
      supervisor: contract.supervisor
    });
    setShowEditModal(true);
  }

  async function handleDeleteClick(name, address, company) {
    if (window.confirm('Are you sure you want to delete this pharmacy contract?')) {
      try {
        // First try to use the RPC if available
        let result = await supabase.rpc('delete_pharmacy_contract', { 
          p_name: name,
          p_address: address,
          p_company: company
        });
        
        // If RPC fails, fall back to direct delete
        if (result.error) {
          console.warn('RPC failed, falling back to direct delete:', result.error);
          result = await supabase
            .from('pharmacy_contract')
            .delete()
            .eq('phaname', name)
            .eq('pha_address', address)
            .eq('pharma_company', company);
        }

        if (result.error) throw result.error;
        
        setSuccessMessage('Pharmacy contract deleted successfully');
        fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting pharmacy contract:', error.message);
        setError('Failed to delete pharmacy contract: ' + error.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCurrentContract(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handlePharmacyChange(e) {
    const selectedPharmacy = JSON.parse(e.target.value);
    setCurrentContract(prev => ({
      ...prev,
      phaname: selectedPharmacy.phname,
      pha_address: selectedPharmacy.phaddress
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    try {
      // First try to use the RPC if available
      let result = await supabase.rpc('add_pharmacy_contract', {
        p_name: currentContract.phaname,
        p_address: currentContract.pha_address,
        p_company: currentContract.pharma_company,
        p_start: currentContract.start_date,
        p_end: currentContract.end_date,
        p_content: currentContract.content,
        p_supervisor: currentContract.supervisor
      });
      
      // If RPC fails, fall back to direct insert
      if (result.error) {
        console.warn('RPC failed, falling back to direct insert:', result.error);
        result = await supabase
          .from('pharmacy_contract')
          .insert({
            phaname: currentContract.phaname,
            pha_address: currentContract.pha_address,
            pharma_company: currentContract.pharma_company,
            start_date: currentContract.start_date,
            end_date: currentContract.end_date,
            content: currentContract.content,
            supervisor: currentContract.supervisor
          });
      }

      if (result.error) throw result.error;
      
      setSuccessMessage('Pharmacy contract added successfully');
      fetchData();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding pharmacy contract:', error.message);
      setError('Failed to add pharmacy contract: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      // First try to use the RPC if available
      let result = await supabase.rpc('update_pharmacy_contract', {
        p_name: currentContract.phaname,
        p_address: currentContract.pha_address,
        p_company: currentContract.pharma_company,
        p_start: currentContract.start_date,
        p_end: currentContract.end_date,
        p_content: currentContract.content,
        p_supervisor: currentContract.supervisor
      });
      
      // If RPC fails, fall back to direct update
      if (result.error) {
        console.warn('RPC failed, falling back to direct update:', result.error);
        result = await supabase
          .from('pharmacy_contract')
          .update({
            start_date: currentContract.start_date,
            end_date: currentContract.end_date,
            content: currentContract.content,
            supervisor: currentContract.supervisor
          })
          .eq('phaname', currentContract.phaname)
          .eq('pha_address', currentContract.pha_address)
          .eq('pharma_company', currentContract.pharma_company);
      }

      if (result.error) throw result.error;
      
      setSuccessMessage('Pharmacy contract updated successfully');
      fetchData();
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating pharmacy contract:', error.message);
      setError('Failed to update pharmacy contract: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  if (loading) {
    return <div>Loading pharmacy contracts...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Pharmacy Contracts</h1>
          <button onClick={handleAddClick}>Add Contract</button>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <table>
          <thead>
            <tr className="tables">
              <th>Pharmacy</th>
              <th>Address</th>
              <th>Company</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Content</th>
              <th>Supervisor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr>
                <td colSpan="8">No pharmacy contracts found</td>
              </tr>
            ) : (
              contracts.map(contract => (
                <tr key={`${contract.phaname}-${contract.pha_address}-${contract.pharma_company}`}>
                  <td>{contract.phaname}</td>
                  <td>{contract.pha_address}</td>
                  <td>{contract.pharma_company}</td>
                  <td>{formatDate(contract.start_date)}</td>
                  <td>{formatDate(contract.end_date)}</td>
                  <td>{contract.content}</td>
                  <td>{contract.supervisor}</td>
                  <td className="flex-box">
                    <button onClick={() => handleEditClick(contract)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteClick(contract.phaname, contract.pha_address, contract.pharma_company)}
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

      {/* Add Contract Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Pharmacy Contract</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="pharmacy">Pharmacy</label>
                <select
                  id="pharmacy"
                  name="pharmacy"
                  onChange={handlePharmacyChange}
                  required
                >
                  <option value="">Select a pharmacy</option>
                  {pharmacies.map(pharmacy => (
                    <option 
                      key={`${pharmacy.phname}-${pharmacy.phaddress}`} 
                      value={JSON.stringify({phname: pharmacy.phname, phaddress: pharmacy.phaddress})}
                    >
                      {pharmacy.phname} - {pharmacy.phaddress}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pharma_company">Pharmaceutical Company</label>
                <select
                  id="pharma_company"
                  name="pharma_company"
                  value={currentContract.pharma_company}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.phcname} value={company.phcname}>
                      {company.phcname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={currentContract.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={currentContract.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={currentContract.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="supervisor">Supervisor</label>
                <input
                  type="text"
                  id="supervisor"
                  name="supervisor"
                  value={currentContract.supervisor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Add Contract</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contract Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Pharmacy Contract</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Pharmacy: {currentContract.phaname}</label>
              </div>
              <div className="form-group">
                <label>Address: {currentContract.pha_address}</label>
              </div>
              <div className="form-group">
                <label>Company: {currentContract.pharma_company}</label>
              </div>
              <div className="form-group">
                <label htmlFor="edit-start_date">Start Date</label>
                <input
                  type="date"
                  id="edit-start_date"
                  name="start_date"
                  value={currentContract.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-end_date">End Date</label>
                <input
                  type="date"
                  id="edit-end_date"
                  name="end_date"
                  value={currentContract.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-content">Content</label>
                <textarea
                  id="edit-content"
                  name="content"
                  value={currentContract.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-supervisor">Supervisor</label>
                <input
                  type="text"
                  id="edit-supervisor"
                  name="supervisor"
                  value={currentContract.supervisor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Update Contract</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PharmacyContract;