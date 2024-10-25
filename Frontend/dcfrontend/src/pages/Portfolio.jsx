import React from 'react'
import '../Css/Dashboard.css';
import Analysisdata from '../Components/Analysisdata';
import News from '../Components/News';
function Portfolio() {
  return (
    <div className="dashboard-container">
        <div className="dashboard-content">
            <div>
                <Analysisdata heading={"Portfolio"}/>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <div>
                    <p>No data added</p>
                </div>
                <div>   
                    <News/>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Portfolio