import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Footer from '../Components/Footer'
import Highlight from '../Components/Highlight'
import HomeHeader from '../Components/HomeHeader'
import Navbar from '../Components/Navbar'
import OfferBanner from '../Components/OfferBanner'
import OurCourses from '../Components/OurCourses'
import Subscribe from '../Components/Subscribe'
import Testimonials from '../Components/Testimonials'
import WhoAreWe from '../Components/WhoAreWe'
import { fetchActiveBannerApi } from '../Config/Api'

const HomePage = () => {
    const [bannerData, setBannerData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const findActiveBanner = async () => {
            setIsLoading(true);
            const res = await axios.get(fetchActiveBannerApi);

            if (res.status === 200 && res.data.success === true) {
                const { success, ...others } = res.data;
                setBannerData(others);
                setIsLoading(false);
            }
        }
        findActiveBanner();
    }, []);

    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 20) {
            setShowScroll(true)
        } else if (showScroll && window.pageYOffset <= 20) {
            setShowScroll(false)
        }
    };

    window.addEventListener('scroll', checkScrollTop)

    return (
        <div className="homePage" style={{ position: "relative" }}>
            {
                !isLoading &&
                <OfferBanner bannerData={bannerData} />
            }
            <Navbar top={bannerData ? "60px" : "0"} scrolled={showScroll} color={showScroll ? "" : "transparent"} page="home" />
            <HomeHeader />
            <WhoAreWe />
            <Highlight />
            <OurCourses />
            <Testimonials />
            <Subscribe />
            <Footer />
        </div>
    )
}

export default HomePage;