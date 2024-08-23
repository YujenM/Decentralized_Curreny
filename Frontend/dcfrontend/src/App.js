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
import Navbar from './Components/Nabar';
import Dashboard from './pages/Dashboard';
import ProtectedRoutes from './Components/ProtectedRoutes';
import UserState from './Context/User/Userstate';
import Alert from './Components/Alert';
import { useState } from 'react';

const DisplayNavbar = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup','/'];

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
    }, 2000);
  }

  return (
    <div className="App">
      <UserState>
        <Router>
          <DisplayNavbar />
          {alert && <Alert message={alert.msg} type={alert.type} icon={alert.icon} />}
          <Routes>
            <Route exact path='/' element={<Intropage />} />
            <Route exact path='/login' element={<Login Displayalert={Displayalert} />} />
            <Route exact path='/signup' element={<Signuppage />} />
            <Route exact path='/dashboard' element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            } />
          </Routes>
        </Router>
      </UserState>
    </div>
  );
}

export default App;
