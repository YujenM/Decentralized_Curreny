import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Analysis.css';
import Analysisdatacar from '../Components/Analysisdatacar';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import UserContext from '../Context/User/Usercontext';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min:500 },
    items: 3,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 500, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

function Analysisdata(props) {
  const { analysisData, getanalysisdata } = useContext(UserContext);
  const hasFetchedData = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetchedData.current) {
      getanalysisdata();
      hasFetchedData.current = true;
    }
    // console.log(analysisData); 
  }, [getanalysisdata]);
  

  const handleSymbolClick = (uuid) => {
    navigate('/dashboard/analysis', { state: { uuid } }); 
  };

  return (
    <div className='analysisbg'>
      <h1 className='analysishead'>{props.heading}</h1>
      {analysisData && analysisData.length > 0 ? (
        <Carousel
          swipeable={true}
          draggable={true}
          responsive={responsive}
          ssr={true}
          autoPlay={true}
          keyBoardControl={true}
          customTransition="all .5"
          containerClass="carousel-container"
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          className='analysisdatacar'
        >
          {analysisData.map((item) => (
            <div
              key={item.UUID}
              onClick={() => handleSymbolClick(item.UUID)}
              className='analysisdatacar-wrapper'
              style={{ cursor: 'pointer' }}
            >
              <Analysisdatacar
                className='analysisdatacar'
                symbol={item.Crypto_Symbol}
                cryptoimage={item.Crypto_image}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <p className='no-data-message'>There is no data available.</p>
      )}
    </div>
  );
}

export default Analysisdata;
