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
import Trending from  './pages/Trending';
import ProtectedRoutes from './Components/ProtectedRoutes';
import UserState from './Context/User/Userstate';
import NewsState from './Context/news/NewsState';
import Trendingdata from './Context/Trendingdata/Trendingstate'
import Alert from './Components/Alert';
import { useState } from 'react';
import Analysisdata from './pages/AnalysisDetails';
import Detailenews from './pages/Detailenews';

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
            <Route exact path='/dashboard/analysis' element={
              <ProtectedRoutes>
                <Analysisdata />
              </ProtectedRoutes>
            } />
            <Route exact path='/dashboard/News' element={
              <ProtectedRoutes>
                <Detailenews/>
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
