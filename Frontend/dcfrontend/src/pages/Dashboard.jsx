import React from 'react'
import '../Css/Dashboard.css'
import Analysisdata from '../Components/Analysisdata';
import DashboardChart from '../Components/dashboardchart';
import Tabledata from '../Components/Tabledata';
import News from '../Components/News';
import '../Css/Dashnews.css'

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Analysisdata/>
      </div>
      <div>
        <DashboardChart/>
      </div>
      <div className='grid grid-cols-2 gap-1'>
        <Tabledata/>
        <div className='newsdash'>
          <News/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard