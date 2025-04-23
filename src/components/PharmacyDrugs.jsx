import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import './PharmacyDrugs.css';

function PharmacyDrugs() {
  const [pharmacyDrugs, setPharmacyDrugs] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [pharmaceuticalCompanies, setPharmaceuticalCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentPharmacyDrug, setCurrentPharmacyDrug] = useState({
    phaname: '',
    pha_address: '',
    pharma_company: '',
    drug_name: '',
    price: ''
  });
  const [searchPharmacy, setSearchPharmacy] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalDrugs, setTotalDrugs] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch pharmacy drugs
      const { data: pharmacyDrugsData, error: pharmacyDrugsError } = await supabase
        .from('pharmacy_drugs')
        .select('*')
        .order('phaname');

      if (pharmacyDrugsError) throw pharmacyDrugsError;
      
      // Fetch pharmacies for dropdown
      const { data: pharmacyData, error: pharmacyError } = await supabase
        .from('pharmacy')
        .select('phname, phaddress')
        .order('phname');

      if (pharmacyError) throw pharmacyError;
      
      // Fetch drugs for dropdown
      const { data: drugData, error: drugError } = await supabase
        .from('drug')
        .select('phcompany, trade_name')
        .order('trade_name');

      if (drugError) throw drugError;
      
      // Fetch pharmaceutical companies for reference
      const { data: pharmaCompanyData, error: pharmaCompanyError } = await supabase
        .from('pharmaceutical_company')
        .select('phcname, phcphone')
        .order('phcname');

      if (pharmaCompanyError) throw pharmaCompanyError;
      
      // Enrich pharmacy drugs with pharmacy and drug details
      const enrichedPharmacyDrugs = pharmacyDrugsData.map(pd => {
        const pharmacy = pharmacyData.find(p => 
          p.phname === pd.phaname && p.phaddress === pd.pha_address
        );
        
        const drug = drugData.find(d => 
          d.phcompany === pd.pharma_company && d.trade_name === pd.drug_name
        );
        
        return {
          ...pd,
          pharmacy: pharmacy || { phname: 'Unknown', phaddress: 'Unknown' },
          drug: drug || { phcompany: 'Unknown', trade_name: 'Unknown' }
        };
      });
      
      setPharmacyDrugs(enrichedPharmacyDrugs || []);
      setPharmacies(pharmacyData || []);
      setDrugs(drugData || []);
      setPharmaceuticalCompanies(pharmaCompanyData || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setCurrentPharmacyDrug({
      phaname: '',
      pha_address: '',
      pharma_company: '',
      drug_name: '',
      price: ''
    });
    setShowAddModal(true);
  }

  function handleEditClick(pharmacyDrug) {
    setCurrentPharmacyDrug({
      phaname: pharmacyDrug.phaname,
      pha_address: pharmacyDrug.pha_address,
      pharma_company: pharmacyDrug.pharma_company,
      drug_name: pharmacyDrug.drug_name,
      price: pharmacyDrug.price
    });
    setShowEditModal(true);
  }

  function handleSearchClick() {
    setSearchPharmacy('');
    setSearchResults([]);
    setTotalDrugs(0);
    setShowSearchModal(true);
  }

  async function handleSearch(e) {
    e.preventDefault();
    
    if (!searchPharmacy) {
      setError('Please enter a pharmacy name');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      // Search for drugs by pharmacy name
      const { data, error } = await supabase
        .from('pharmacy_drugs')
        .select('*')
        .ilike('phaname', `%${searchPharmacy}%`);
      
      if (error) throw error;
      
      setSearchResults(data || []);
      setTotalDrugs(data.length);
    } catch (error) {
      console.error('Error searching pharmacy drugs:', error.message);
      setError('Failed to search pharmacy drugs: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleDeleteClick(phaname, pha_address, pharma_company, drug_name) {
    if (window.confirm('Are you sure you want to delete this pharmacy drug?')) {
      try {
        const { error } = await supabase.rpc('delete_pharmacy_drug', { 
          p_name: phaname, 
          p_address: pha_address, 
          p_company: pharma_company, 
          p_drug: drug_name 
        });

        if (error) throw error;
        setSuccessMessage('Pharmacy drug deleted successfully');
        fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting pharmacy drug:', error.message);
        setError('Failed to delete pharmacy drug: ' + error.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCurrentPharmacyDrug(prev => ({
      ...prev,
      [name]: name === 'price' ? parseInt(value) || '' : value
    }));
  }

  function handlePharmacyChange(e) {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex === 0) return; // Skip the default "Select" option
    
    const selectedOption = e.target.options[selectedIndex];
    const pharmacy = pharmacies[selectedIndex - 1]; // -1 to account for the "Select" option
    
    setCurrentPharmacyDrug(prev => ({
      ...prev,
      phaname: pharmacy.phname,
      pha_address: pharmacy.phaddress
    }));
  }

  function handleDrugChange(e) {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex === 0) return; // Skip the default "Select" option
    
    const drug = drugs[selectedIndex - 1]; // -1 to account for the "Select" option
    
    setCurrentPharmacyDrug(prev => ({
      ...prev,
      pharma_company: drug.phcompany,
      drug_name: drug.trade_name
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    
    // Validate inputs
    if (!currentPharmacyDrug.phaname || !currentPharmacyDrug.pha_address || 
        !currentPharmacyDrug.pharma_company || !currentPharmacyDrug.drug_name || 
        currentPharmacyDrug.price === '') {
      setError('All fields are required');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      const { error } = await supabase.rpc('add_pharmacy_drug', {
        p_name: currentPharmacyDrug.phaname,
        p_address: currentPharmacyDrug.pha_address,
        p_company: currentPharmacyDrug.pharma_company,
        p_drug: currentPharmacyDrug.drug_name,
        p_price: currentPharmacyDrug.price
      });

      if (error) throw error;
      setSuccessMessage('Pharmacy drug added successfully');
      fetchData();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding pharmacy drug:', error.message);
      setError('Failed to add pharmacy drug: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    
    // Validate price
    if (currentPharmacyDrug.price === '') {
      setError('Price is required');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      const { error } = await supabase.rpc('update_pharmacy_drug', {
        p_name: currentPharmacyDrug.phaname,
        p_address: currentPharmacyDrug.pha_address,
        p_company: currentPharmacyDrug.pharma_company,
        p_drug: currentPharmacyDrug.drug_name,
        p_price: currentPharmacyDrug.price
      });

      if (error) throw error;
      setSuccessMessage('Pharmacy drug updated successfully');
      fetchData();
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating pharmacy drug:', error.message);
      setError('Failed to update pharmacy drug: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  }

  if (loading) {
    return <div>Loading pharmacy drugs...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Pharmacy Drugs</h1>
          <div className="button-group">
            <button onClick={handleAddClick}>Add Pharmacy Drug</button>
            <button onClick={handleSearchClick}>Search by Pharmacy</button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <table>
          <thead>
            <tr className="tables">
              <th>Pharmacy</th>
              <th>Address</th>
              <th>Pharmaceutical Company</th>
              <th>Drug Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pharmacyDrugs.length === 0 ? (
              <tr>
                <td colSpan="6">No pharmacy drugs found</td>
              </tr>
            ) : (
              pharmacyDrugs.map((pd, index) => (
                <tr key={index}>
                  <td>{pd.phaname}</td>
                  <td>{pd.pha_address}</td>
                  <td>{pd.pharma_company}</td>
                  <td>{pd.drug_name}</td>
                  <td>${pd.price}</td>
                  <td>
                    <button onClick={() => handleEditClick(pd)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteClick(pd.phaname, pd.pha_address, pd.pharma_company, pd.drug_name)}
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

      {/* Add Pharmacy Drug Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Pharmacy Drug</h2>
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
                  {pharmacies.map((pharmacy, index) => (
                    <option key={index} value={index}>
                      {pharmacy.phname} - {pharmacy.phaddress}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="drug">Drug</label>
                <select
                  id="drug"
                  name="drug"
                  onChange={handleDrugChange}
                  required
                >
                  <option value="">Select a drug</option>
                  {drugs.map((drug, index) => (
                    <option key={index} value={index}>
                      {drug.trade_name} ({drug.phcompany})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={currentPharmacyDrug.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Add Pharmacy Drug</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pharmacy Drug Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Pharmacy Drug</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Pharmacy: {currentPharmacyDrug.phaname}</label>
              </div>
              <div className="form-group">
                <label>Address: {currentPharmacyDrug.pha_address}</label>
              </div>
              <div className="form-group">
                <label>Pharmaceutical Company: {currentPharmacyDrug.pharma_company}</label>
              </div>
              <div className="form-group">
                <label>Drug Name: {currentPharmacyDrug.drug_name}</label>
              </div>
              <div className="form-group">
                <label htmlFor="edit-price">Price</label>
                <input
                  type="number"
                  id="edit-price"
                  name="price"
                  value={currentPharmacyDrug.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Update Price</button>
            </form>
          </div>
        </div>
      )}

      {/* Search by Pharmacy Modal */}
      {showSearchModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Search Drugs by Pharmacy</h2>
              <button className="close-button" onClick={() => setShowSearchModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSearch}>
              <div className="form-group">
                <label htmlFor="search-pharmacy">Pharmacy Name</label>
                <input
                  type="text"
                  id="search-pharmacy"
                  name="searchPharmacy"
                  value={searchPharmacy}
                  onChange={(e) => setSearchPharmacy(e.target.value)}
                  placeholder="Enter full or partial pharmacy name"
                  required
                />
              </div>
              <button type="submit">Search</button>
            </form>

            {searchResults.length > 0 && (
              <div className="search-results">
                <h3>Results for "{searchPharmacy}"</h3>
                <p className="total-drugs">Total drugs: {totalDrugs}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Pharmacy</th>
                      <th>Address</th>
                      <th>Drug Name</th>
                      <th>Pharmaceutical Company</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((result, index) => (
                      <tr key={index}>
                        <td>{result.phaname}</td>
                        <td>{result.pha_address}</td>
                        <td>{result.drug_name}</td>
                        <td>{result.pharma_company}</td>
                        <td>${result.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {searchResults.length === 0 && searchPharmacy !== '' && (
              <div className="no-results">
                <p>No drugs found for pharmacy "{searchPharmacy}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PharmacyDrugs;