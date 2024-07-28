import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,  
} from 'react-router-dom';
import Intropage from './pages/Intropage';
import Login from './pages/Login';
import Signuppage from './pages/Signuppage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<Intropage/>}/>
          <Route exact path='/Login' element={<Login/>}/>
          <Route exact path='/Signup' element={<Signuppage/>}/>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
