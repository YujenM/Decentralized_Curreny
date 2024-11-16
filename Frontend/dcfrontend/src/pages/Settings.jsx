import React, { useState } from 'react';
import '../Css/Setting.css';
import { Link } from 'react-router-dom';
import Personalinfo from '../Components/Personalinfo';
import Updatepassword from '../Components/updatepassword';
import Terms from '../Components/Terms';
import About from '../Components/About';
function Settings({ Displayalert }) {
  const [activeTab, setActiveTab] = useState('personalInfo');

  const renderContent = () => {
    switch (activeTab) {
      case 'personalInfo':
        return <Personalinfo Displayalert={Displayalert} />;
      case 'passwordSecurity':
        return <Updatepassword Displayalert={Displayalert} />;
      case 'helpSupport':
        return <Terms />; 
      case 'aboutUs':
        return <About />; 
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="settingsheading">
          <h1>Settings</h1>
        </div>
        <div className="settingscontent">
          <Link
            className={`settingtitle ${activeTab === 'personalInfo' ? 'active' : ''}`}
            onClick={() => setActiveTab('personalInfo')}
          >
            Personal Info
          </Link>
          <Link
            className={`settingtitle ${activeTab === 'passwordSecurity' ? 'active' : ''}`}
            onClick={() => setActiveTab('passwordSecurity')}
          >
            Password & Security
          </Link>
          <Link
            className={`settingtitle ${activeTab === 'helpSupport' ? 'active' : ''}`}
            onClick={() => setActiveTab('helpSupport')}
          >
            Terms & Conditions
          </Link>
          <Link
            className={`settingtitle ${activeTab === 'aboutUs' ? 'active' : ''}`}
            onClick={() => setActiveTab('aboutUs')}
          >
            About Us
          </Link>
        </div>
        <div className="settings-content-display">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Settings;
