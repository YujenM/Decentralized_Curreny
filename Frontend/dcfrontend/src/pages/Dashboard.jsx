import React from 'react'
import '../Css/Dashboard.css'
import Analysisdata from '../Components/Analysisdata';
import DashboardChart from '../Components/dashboardchart';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Analysisdata/>
      </div>
      <div>
        <DashboardChart/>
      </div>
    </div>
  )
}

export default Dashboard