import React, { useEffect} from "react";
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import '../Css/Authentication.css'
import logo from '../Images/logo.png'
function Intropage() {
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem("authtoken");
    if (authToken) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <div className='maindiv '>
      <div className="grid grid-cols-2 gap-5">
        <div className="intro">
          <div className="center">
            <h1 className='text-4xl'>Get Started</h1>
            <div className="button">
              <div className='mt-4'> 
                <Link to='/login' className='loginsignbtn'>Login</Link> <br/>
                <Link to='/signup' className='loginsignbtn'>Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="logo">
          <div>
              <div className="flex mark iflex-row ">
                <img src={logo} alt="logo" className="logo-img"/>
                <h1 className='mt-7 text-4xl'>M.A.R.K</h1>
              </div>
              <p>
                Market Analysis Of Real-Time Kurrencies
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Intropage
