import React from 'react';
import '../Css/Analysis.css';
import Analysisdatacar from '../Components/Analysisdatacar';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

function Analysisdata() {
    const data = [
        {
            "UUID": "25W7FG7om",
            "Crypto_Symbol": "DOT",
            "Crypto_image": "https://cdn.coinranking.com/V3NSSybv-/polkadot-dot.svg"
        },
        {
            "UUID": "D7B1x_ks7WhV5",
            "Crypto_Symbol": "LTC",
            "Crypto_image": "https://cdn.coinranking.com/BUvPxmc9o/ltcnew.svg"
        },
        {
            "UUID": "dvUj0CzDZ",
            "Crypto_Symbol": "AVAX",
            "Crypto_image": "https://cdn.coinranking.com/S0C6Cw2-w/avax-avalanche.png"
        },
        {
            "UUID": "Qwsogvtv82FCd",
            "Crypto_Symbol": "BTC",
            "Crypto_image": "https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg"
        },
        {
            "UUID": "razxDUgYGNAdQ",
            "Crypto_Symbol": "ETH",
            "Crypto_image": "https://cdn.coinranking.com/rk4RKHOuW/eth.svg"
        }
    ];

    return (
        <div>
            <h1 className='analysishead'>Analysis Data</h1>
            <Carousel
                swipeable={true}
                draggable={false}
                // showDots={true}
                responsive={responsive}
                ssr={true} 
                // infinite={true}
                autoPlay={true} // Set to true or conditionally based on device type
                // autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                // removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
            >
                {data.map((item) => (
                    <Analysisdatacar
                        key={item.UUID}
                        symbol={item.Crypto_Symbol}
                        cryptoimage={item.Crypto_image}
                    />
                ))}
            </Carousel>
        </div>
    );
}

export default Analysisdata;
