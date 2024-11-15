import React from 'react'
import '../Css/Setting.css';
import { Link } from 'react-router-dom';
import Personalinfo from '../Components/Personalinfo';



function Settings() {
  return (
    <div className='dashboard-container'>
        <div className='dashboard-content'>
          <div className="settingsheading">
            <h1>Settings</h1>
          </div>
          <div className="settingscontent">
            <Link className='settingtitle'>Personal Info</Link>
            <Link className='settingtitle'>Password&Security</Link>
            <Link className='settingtitle'>Help & Support</Link>
            <Link className='settingtitle'>About Us</Link>
          </div>
          <div>
            <Personalinfo/>
          </div>


        </div>
        
    </div>
  )
}

export default Settings