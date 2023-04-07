import React from 'react'
import Navbar from './Navbar'
import errorPng from "../Assets/errorPng.png";
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className="errorComponent">
                <img src={errorPng} alt="" />
                <h1 className='title'>
                    404 - Looks like you’re lost
                </h1>
                <p className="desc">
                    Maybe this page used to exist or you just spelled something wrong.
                    Chances are you spelled something wrong, so can you double check the URL?
                </p>
                <button onClick={() => { navigate("/") }} className="learnmore">
                    Return Home<ion-icon name="arrow-forward"></ion-icon>
                </button>
            </div>
        </div>
    )
}

export default ErrorPage