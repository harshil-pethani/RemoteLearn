import React, { useEffect, useMemo, useState } from 'react'

const OfferBanner = ({ bannerData }) => {
    const [activeBanner, setActiveBanner] = useState(false);

    const deadline = bannerData?.enddate;
    const parsedDeadline = useMemo(() => Date.parse(deadline + " 00:00:00"), [deadline]);
    const [time, setTime] = useState(parsedDeadline - Date.now());

    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    useEffect(() => {
        const interval = setInterval(
            () => setTime(parsedDeadline - Date.now()),
            1000,
        );
        return () => clearInterval(interval);
    }, [parsedDeadline]);

    // console.log(Date.parse(bannerData?.startdate + " 00:00:00") < Date.now());
    // console.log(Date.now());
    // console.log(Date.parse(bannerData?.startdate + " 00:00:00"));
    useEffect(() => {
        if (bannerData && (Date.parse(bannerData?.startdate + " 00:00:00")) < Date.now() && (Date.parse(bannerData?.enddate + " 00:00:00")) > Date.now()) {
            setActiveBanner(true);
        }
    }, [bannerData]);

    return (
        activeBanner &&
        <div className={"offerBanner active"}>
            <p className="bannerTitle">
                {bannerData.bannertext} {bannerData.bannercode.toUpperCase()}
            </p>
            <div className="timerBox">
                <h2 className="timer">
                    {`${Math.floor(time / DAY)}`.padStart(2, "0")}:{`${Math.floor((time / HOUR) % 24)}`.padStart(2, "0")}:{`${Math.floor((time / MINUTE) % 60)}`.padStart(2, "0")}:{`${Math.floor((time / SECOND) % 60)}`.padStart(2, "0")}
                </h2>
                <div className="timerTitles">
                    <h4>
                        Days
                    </h4>
                    <h4>
                        Hrs
                    </h4>
                    <h4>
                        Mins
                    </h4>
                    <h4>
                        Secs
                    </h4>
                </div>
            </div>
            <ion-icon onClick={() => setActiveBanner(false)} name="close-circle-outline"></ion-icon>
        </div>
    )
}

export default OfferBanner