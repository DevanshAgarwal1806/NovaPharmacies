import React, { useState, useEffect } from 'react';
import { supabase } from '../App';

function Dashboard() {
  const [counts, setCounts] = useState({
    doctors: 0,
    patients: 0,
    pharmaceuticals: 0,
    drugs: 0,
    pharmacies: 0,
    prescriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [
          { count: doctorCount },
          { count: patientCount },
          { count: pharmaCount },
          { count: drugCount },
          { count: pharmacyCount },
          { count: prescriptionCount }
        ] = await Promise.all([
          supabase.from('doctor').select('*', { count: 'exact', head: true }),
          supabase.from('patient').select('*', { count: 'exact', head: true }),
          supabase.from('pharmaceutical_company').select('*', { count: 'exact', head: true }),
          supabase.from('drug').select('*', { count: 'exact', head: true }),
          supabase.from('pharmacy').select('*', { count: 'exact', head: true }),
          supabase.from('prescription').select('*', { count: 'exact', head: true })
        ]);

        setCounts({
          doctors: doctorCount,
          patients: patientCount,
          pharmaceuticals: pharmaCount,
          drugs: drugCount,
          pharmacies: pharmacyCount,
          prescriptions: prescriptionCount
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Doctors</h2>
          <div className="dashboard-card-count">{counts.doctors}</div>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Patients</h2>
          <div className="dashboard-card-count">{counts.patients}</div>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Pharmaceutical Companies</h2>
          <div className="dashboard-card-count">{counts.pharmaceuticals}</div>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Drugs</h2>
          <div className="dashboard-card-count">{counts.drugs}</div>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Pharmacies</h2>
          <div className="dashboard-card-count">{counts.pharmacies}</div>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Prescriptions</h2>
          <div className="dashboard-card-count">{counts.prescriptions}</div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;