import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,  
  useLocation
} from 'react-router-dom';
import Intropage from './pages/Intropage';
import Login from './pages/Login';
import Signuppage from './pages/Signuppage';
import Forgetpassword from './pages/Forgetpassword';
import Forgetpasspin from './pages/frogetpasswordpin';
import Changepassword from './pages/Changepassword';
import Navbar from './Components/Nabar';
// pgaes
import Dashboard from './pages/Dashboard';
import Trending from  './pages/Trending';
import Portfolio from './pages/Portfolio'
// 
import ProtectedRoutes from './Components/ProtectedRoutes';
// states
import UserState from './Context/User/Userstate';
import NewsState from './Context/news/NewsState';

// 
import Trendingdata from './Context/Trendingdata/Trendingstate'
import Alert from './Components/Alert';
import { useState } from 'react';
import Analysisdata from './pages/AnalysisDetails';
import Detailenews from './pages/Detailenews';
import Settings from './pages/Settings';

const DisplayNavbar = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup','/', '/forgetpassword', '/forgetpasswordpin','/changepassword'];

  if (hideNavbarRoutes.includes(location.pathname.toLowerCase())) {
    return null; 
  }

  return <Navbar/>; 
};

function App() {
  const [alert, setAlert] = useState(null);

  const Displayalert = (message, type, icon) => {
    setAlert({
      msg: message,
      type,
      icon,
    });

    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }

  return (
    <div className="App">
      <UserState>
      <NewsState>
      <Trendingdata>
      <Router>
          <DisplayNavbar />
          {alert && <Alert message={alert.msg} type={alert.type} icon={alert.icon} />}
          <Routes>
            <Route exact path='/' element={<Intropage />} />
            <Route exact path='/login' element={<Login Displayalert={Displayalert} />} />
            <Route exact path='/signup' element={<Signuppage Displayalert={Displayalert} />} />
            <Route exact path='/forgetpassword' element={<Forgetpassword Displayalert={Displayalert} />} />
            <Route exact path='/forgetpasswordpin' element={<Forgetpasspin Displayalert={Displayalert} />} />
            <Route exact path='/changepassword' element={<Changepassword  Displayalert={Displayalert}/>} />
            <Route exact path='/dashboard' element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            } />
            <Route exact path='/trending' element={
              <ProtectedRoutes>
                <Trending />
              </ProtectedRoutes>
            } />
            <Route exact path='/portfolio' element={
              <ProtectedRoutes>
                <Portfolio Displayalert={Displayalert} />
              </ProtectedRoutes>
            } />
            <Route exact path='/dashboard/analysis' element={
              <ProtectedRoutes>
                <Analysisdata Displayalert={Displayalert} />
              </ProtectedRoutes>
            } />
            <Route exact path='/dashboard/News' element={
              <ProtectedRoutes>
                <Detailenews/>
              </ProtectedRoutes>
            } />
            <Route exact path='/settings' element={
              <ProtectedRoutes>
                <Settings/>
              </ProtectedRoutes>
            } />
          </Routes>
        </Router>
      </Trendingdata>
      </NewsState>
      </UserState>
    </div>
  );
}

export default App;
