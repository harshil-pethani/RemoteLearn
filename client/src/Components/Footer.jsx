import React from 'react'
import { Link } from 'react-router-dom';
import logo from "../Assets/logo.png";

const Footer = () => {
    return (
        <div className="footerContainer">
            <hr />
            <div className="footer">
                <div className="left">
                    <Link to="/" className="logo">
                        <img loading="lazy" src={logo} alt="" />
                    </Link>
                </div>
                <div className="center">
                    <ul>
                        <li>
                            <Link to="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/services">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact">
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/referral">
                                Referral
                            </Link>
                        </li>
                    </ul>

                </div>
                <div className="right">
                    <p className="email">
                        Email: <span>admin@remotelearn.org</span>
                    </p>
                    <p className="branding">
                        Contact Us - Remote Learn
                    </p>
                    <div className="socialIcons">
                        <a target="_blank" rel="noreferrer" className="icon">
                            <ion-icon name="logo-facebook"></ion-icon>
                        </a>
                        <a target="_blank" rel="noreferrer" className="icon">
                            <ion-icon name="logo-youtube"></ion-icon>
                        </a>
                        <a target="_blank" rel="noreferrer" className="icon">
                            <ion-icon name="logo-linkedin"></ion-icon>
                        </a>
                        <a target="_blank" rel="noreferrer" className="icon">
                            <ion-icon name="logo-instagram"></ion-icon>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer;