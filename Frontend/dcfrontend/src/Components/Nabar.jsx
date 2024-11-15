import React, { useState, useEffect, useContext,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icon from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { Navbaritems } from '../Components/Navbaritems';
import logo from '../Images/logo.png';
import '../Css/Nav.css';
import UserContext from '../Context/User/Usercontext';

const Navbar = () => {
    const { state, getUser } = useContext(UserContext); 
    const [sidebar, setSidebar] = useState(false);
    const location = useLocation();
    const hasFetchedData = useRef(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 900) {
                setSidebar(true);
            } else {
                setSidebar(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!hasFetchedData.current) {
            getUser();
            hasFetchedData.current = true;
        }
        // console.log(state)
        // eslint-disable-next-line
    }, [getUser,state]); 

    const showSidebar = () => setSidebar(!sidebar);

    const getLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const getfirstname = (username) => {
        if (username) {
            return username.split(' ')[0];
        }
    }
    const userprofile=state.User_Photo;

    return (
        <div>
            <div className="Navbar">
                <Link to="#" className="menubars">
                    <FontAwesomeIcon icon={icon.faBars} size="xl" onClick={showSidebar} />
                </Link>
                <div className="search-container">
                    {/* <input type="text" placeholder="Search..." className="search-input" />
                    <button className="search-button">
                        <FontAwesomeIcon icon={icon.faSearch} />
                    </button> */}
                </div>
                {window.innerWidth >= 900 && (
                    <div className="user-container mr-3">
                        <p className="mr-4 text-2xl username">
                            Welcome {getfirstname(state?.User_Name) || 'User'}
                        </p>
                        {
                            state?.User_Photo ? (
                                
                                <img src={userprofile} alt="User" className="user-img" />
                            ) : (
                                <FontAwesomeIcon icon={icon.faUserCircle} size="2x" />
                            )
                        }
                    </div>
                )}
            </div>
            <nav className={sidebar || window.innerWidth >= 900 ? 'nav-menu active' : 'nav-menu'}>
                <div className="sidebar-header">
                    <div className="Marklogo">
                        <img src={logo} alt="Logo" className="logo-img" />
                        
                        <span className="logo-name">M.A.R.K</span>
                    </div>
                    {window.innerWidth < 900 && (
                        <Link to="#" className="menu-bars">
                            <FontAwesomeIcon className="menubars" icon={icon.faTimes} onClick={showSidebar} />
                        </Link>
                    )}
                </div>
                {window.innerWidth < 900 && (
                    <div className="user-container-vertical">
                        <p className="text-2xl username">
                            Welcome {getfirstname(state?.User_Name) || 'User'}
                        </p>
                    </div>
                )}
                <ul className="nav-menu-items">
                    {Navbaritems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={index} className={`${item.cName} ${isActive ? 'active' : ''}`}>
                                <Link to={item.path}>
                                    {isActive && <div className="active-indicator"></div>}
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="logout-container">
                    <button onClick={getLogout}>
                        <FontAwesomeIcon icon={icon.faSignOutAlt} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
