import React, { useEffect, useContext, useRef } from 'react';
import UserContext from '../Context/User/Usercontext';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ChartCard from '../Components/chartcard';

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
};

function Dashboardchart() {
    const { chartdata, getchartdata } = useContext(UserContext);
    let hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            hasFetchedData.current = true;
            getchartdata();
        }
    }, [getchartdata]);
    // console.log(chartdata.data.Sparklingline);
    return (
        <div className="dashboard-chart">
            {chartdata && chartdata.status === "success" && Array.isArray(chartdata.data) && (
                
                <Carousel responsive={responsive}>
                    {chartdata.data.map(crypto => (
                        <div key={crypto.Crypto_Name}>
                            <ChartCard
                                cryptoName={crypto.Crypto_Name}
                                price={crypto.Price.slice(0, 4)}
                                percentageChange={crypto["24HVolume"].slice(0,4)}
                                sparklineData={crypto.Sparklingline ? crypto.Sparklingline.slice(0, 4) : []}  // Check if Sparkline exists
                                iconUrl={crypto.Crypto_image}
                            />
                        </div>
                    ))}
                </Carousel>
            )}
        </div>
    );
}

export default Dashboardchart;
