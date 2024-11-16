import React from 'react';
import terns from '../Components/termscondition.js'; // Fixed the import statement typo (changed 'form' to 'from')

function Terms() {
  return (
    <div className='terms mt-4'>
      {terns.map((term, index) => (
        <div key={index} className='term-item'>
          <h2 className='termstitle mt-2'>{term.ttile}</h2> {/* Kept 'ttile' as per the data format; change to 'title' if typo corrected */}
          <p className='termsdescription'>{term.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Terms;
