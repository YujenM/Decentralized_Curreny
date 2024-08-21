import React, { useState, useEffect, useContext } from 'react';
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
        getUser(); // Fetch user data when the component mounts
    }, []);

    const showSidebar = () => setSidebar(!sidebar);

    const getLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <div>
            <div className="Navbar">
                <Link to="#" className="menubars">
                    <FontAwesomeIcon icon={icon.faBars} size="xl" onClick={showSidebar} />
                </Link>
                <div className="search-container">
                    <input type="text" placeholder="Search..." className="search-input" />
                    <button className="search-button">
                        <FontAwesomeIcon icon={icon.faSearch} />
                    </button>
                </div>
                {window.innerWidth >= 900 && (
                    <div className="user-container mr-3">
                        <p className="mr-4 text-2xl username">Welcome {state.username || 'User'}</p>
                        <FontAwesomeIcon icon={icon.faUser} size="xl" />
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
                        <p className="text-2xl username">Welcome <br/>{state.username || 'User'}</p>   
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
