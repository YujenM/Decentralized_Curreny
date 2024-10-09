import React from 'react'
import '../Css/Dashboard.css'
import Analysisdata from '../Components/Analysisdata';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Analysisdata/>
      </div>
    </div>
  )
}

export default Dashboard