import React from 'react'
import Navbar from '../Components/Navbar'
import {
  BrowserRouter as Router,
  Routes,
  Route,  
} from 'react-router-dom';
import Dashboard from './Dashboard';

function Main() {
  return (
    <div>
        <Router>
          <Navbar/>
          <Routes>
            <Route exact path={'/dashboard'} element={<Dashboard/>}/>
          </Routes>
        </Router>
    </div>
  )
}

export default Main