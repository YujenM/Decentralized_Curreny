import React from 'react';
import '../Css/Alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

function Alert({ message, type="Danger", icon = 'faCheck' }) {
    const IconComponent = icons[icon];

    return (
        <div className='Alertbox mt-5'>
            <div className="alert">
                <div className={`icon mr-3 ${type}`}>
                    <FontAwesomeIcon icon={IconComponent} size="sm" className="fonticon" />
                </div>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default Alert;
