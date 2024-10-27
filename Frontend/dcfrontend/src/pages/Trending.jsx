import React from 'react'
import '../Css/Dashboard.css';
import Trendingchart from '../Components/Trendingchart';



function Trending() {
  return (
    <div className='dashboard-container'>
        <div className="dashboard-content">
            <h1 className='Pagetitle' >Trending Prediction Module</h1>
            <Trendingchart/>
        </div>


    </div>
  )
}

export default Trending