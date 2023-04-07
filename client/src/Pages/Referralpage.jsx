import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Referral from '../Components/Referral'

const Referralpage = () => {
    const [termPopupActive, setTermPopupActive] = useState(false);

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
        <div className="referralPage" style={{ position: "relative" }}>
            <Navbar scrolled={showScroll} />
            {
                termPopupActive &&
                (
                    <div className="popUpLayer">
                        <div className="popUpBox">
                            <ion-icon onClick={() => setTermPopupActive(false)} name="close-circle-outline"></ion-icon>
                            <h2 className="title">
                                Terms And Conditions
                            </h2>
                            <div className="conditions">
                                <h2 className="subtitle">
                                    Remote Learn Referral Program Rules
                                </h2>
                                <p className="desc">
                                    These Remote Learn Referral Program Rules (“Program Rules”) govern your participation in the Remote Learn Referral Program. The Program Rules are in addition to any agreements between you and Remote Learn, as applicable (collectively, the “Remote Learn Terms”). The Remote Learn Terms are incorporated by reference and shall apply to your participation in the Remote Learn Referral Program, including, if necessary, to resolve any disputes between you and Remote Learn related to or arising out of the Referral Program.
                                </p>
                                <h2 className="subtitle">
                                    Program Overview
                                </h2>
                                <p className="desc">
                                    The Remote Learn Referral Program (“Referral Program”) is offered by Remote Learn, LLC. and its affiliates (together referred to as “Remote Learn”) and provides Users who are interested in referring their family and friends (“Referrers”) the opportunity to refer eligible individuals to join the Remote Learn community. These Program Rules apply to both Referrers and referred Users (“Referred Users” or “Referred” individuals, respectively), so please read carefully to understand your respective rights and obligations.
                                </p>
                                <h2 className="subtitle">
                                    Referrer Eligibility
                                </h2>
                                <p className="desc">
                                    To be eligible to participate in the Referral Program as a Referrer, you must (a) be a legal resident of your country; (b) be the age of majority in your territory of residence; and (c) maintain a Remote Learn account in good standing. However, if you violate the Program Rules, the Remote Learn Terms of Service or any other applicable terms, Remote Learn may suspend or terminate your ability to participate in the Referral Program under any or all of your accounts.
                                </p>
                                <h2 className="subtitle">
                                    Remote Learn Codes
                                </h2>
                                <p className="desc">
                                    Under the Referral Program, Remote Learn may provide you with a unique alphanumeric code (“Remote Learn Code”) to distribute to eligible individuals to become new Remote Learn community members. Remote Learn owns all rights in and to any Remote Learn Code, and may reclaim, deactivate, invalidate or terminate your Remote Learn Code at any time at its discretion.
                                </p>
                                <h2 className="subtitle" style={{ marginBottom: "10px" }}>
                                    How to Refer Users
                                </h2>
                                <h3>
                                    a. Referred Riders.
                                </h3>
                                <p className="desc">
                                    Through the Remote Learn referral platform, you may refer eligible individuals to become new student on the Remote Learn website. In order to be eligible for a Referral Reward (defined below) for a new student, the person must (i) have never previously enrolled with Remote Learn; (ii) be at least the age of majority in their territory of residence, and (iii) satisfy the applicable Reward Criteria, as discussed below. If these conditions are met, the person shall be considered your “Referred User.”
                                </p>
                                <h3>
                                    b. Invitations through the Remote Learn Platform.
                                </h3>
                                <p className="desc">
                                    You may invite your family and friends to become new Students directly through the Remote Learn website by entering or providing Remote Learn with your invitee’s contact information (all information collected by Remote Learn under the Referral Program shall be governed by Remote Learn’s Privacy Policy). Inviting an individual through the Remote Learn Platform may generate an automatic invitation text (SMS) or email (the “Invitation”) to the person which may be sent through your phone number or a number controlled by Remote Learn. The Invitation may contain a promotional offer of Remote Learn credit to a new user. You represent that you have the necessary consent from your invitee to send them the Invitation (either directly or through the Remote Learn Platform). You will have to share your unique code with your friends and family and your Remote Learn Code will not be automatically applied on the new user’s account unless they manually type it in the promo code section as applicable.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
            <Referral setTermPopupActive={setTermPopupActive} />
            <Footer />
        </div>
    )
}

export default Referralpage;