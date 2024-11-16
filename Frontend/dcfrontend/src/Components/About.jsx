import React from 'react'
import logo from '../Images/logo.png'

function About() {
  return (
    <div className='aboutmain '>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className='aboutcontent'>
                Welcome to M.A.R.K. (Market Analysis and Research on Cryptocurrency), a platform designed to help you navigate the rapidly evolving world of decentralized currencies. As part of our capstone project, we aim to provide users with reliable, data-driven predictions on five major cryptocurrencies: Bitcoin, Ethereum, Avalanche, Polka dot, and Lite coin. By utilizing simple machine learning models and comprehensive data analysis, M.A.R.K. empowers users to make informed decisions about their crypto investments.
                </p>
            </div>
            <div>
                <div className='logoimg'>
                    <img src={logo} alt='about' className='aboutimg' />
                </div>
                <p className='aboutcontent'>Our platform offers an intuitive dashboard, personalized portfolio insights, and trending market data to guide both new and experienced traders in the world of cryptocurrency. Built by a team of computer science students in Nepal, we are committed to bringing the benefits of decentralized finance (DeFi) to a wider audience.</p>
            </div>

        </div>

    </div>
  )
}

export default About