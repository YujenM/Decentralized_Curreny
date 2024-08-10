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

function App() {
  const DisplayNavbar = () => {
    const location = useLocation();
    const hideNavbarRoutes = ['/login', '/signup','/'];

    if (hideNavbarRoutes.includes(location.pathname.toLowerCase())) {
      return null; 
    }

    return <Navbar username={"Yujen"} />; 
  };
  return (
    <div className="App">
      <Router>
        <DisplayNavbar/>
        <Routes>
          <Route exact path='/' element={<Intropage/>}/>
          <Route exact path='/Login' element={<Login/>}/>
          <Route exact path='/Signup' element={<Signuppage/>}/>
          <Route exact path='/Dashboard' element={<Dashboard  />}/>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
