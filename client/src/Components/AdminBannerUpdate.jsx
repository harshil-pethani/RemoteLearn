import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getSingleBannerApi, updateBannerApi } from '../Config/Api';
import AdminSide from './AdminSide';
import AdminTop from './AdminTop';
import Loader from './Loader';

const AdminBannerUpdate = ({ adminDetails, setAdminLogged }) => {
    const location = useLocation();
    const [bannerData, setBannerData] = useState({ bannertext: "", startdate: "", enddate: "", bannercode: "", discount: "" });
    const [bannerId, setBannerId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        setBannerId(location.pathname.split("/")[4]);
    }, [location]);

    const validateData = () => {
        if (!bannerData.bannertext || !bannerData.startdate || !bannerData.enddate || !bannerData.bannercode || !bannerData.discount) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else if (bannerData.bannertext.length < 15) {
            setIsError(true);
            setResMsg("Bannertext is very small");
            return false;
        } else if (bannerData.startdate < (new Date()).toISOString().split('T')[0]) {
            setIsError(true);
            setResMsg("Start date is must be future Date");
            return false;
        } else if (bannerData.startdate >= bannerData.enddate) {
            setIsError(true);
            setResMsg("Please Enter Valid Dates");
            return false;
        } else if (bannerData.bannercode.length < 5) {
            setIsError(true);
            setResMsg("Bannercode is very small (Minimum 5 characters are required)");
            return false;
        } else if (bannerData.bannercode.indexOf(' ') >= 0) {
            setIsError(true);
            setResMsg("Bannercode should not contain any space)");
            return false;
        } else if (bannerData.discount > 100 || bannerData.discount < 0) {
            setIsError(true);
            setResMsg("Please Enter valid percentage");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const updateBanner = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsLoading(true);
                const res = await axios.put(updateBannerApi(bannerId), { ...bannerData, bannercode: bannerData.bannercode.toLowerCase() }, { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    navigate("/admin/offerbanner/history");
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
                // console.log(e);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 500) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
            }
        }
    }

    useEffect(() => {
        const getBanner = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(getSingleBannerApi(bannerId), { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    setBannerData(res?.data);
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
        if (bannerId)
            getBanner();
    }, [bannerId]);

    return (
        <div>
            <AdminTop adminDetails={adminDetails} />
            <div className="adminMainContent">
                <AdminSide adminDetails={adminDetails} setAdminLogged={setAdminLogged} />
                {
                    isLoading ?
                        <Loader adminLoader={true} /> :
                        <div className="adminBannerUpdate right">
                            <h2 className="title">
                                Update Offer Banner
                            </h2>
                            <form>
                                <div className="formField">
                                    <label className="fieldTitle" htmlFor="bannerMsg">
                                        Offer Banner Slogan<span>*</span>
                                    </label>
                                    <textarea id="bannerMsg" placeholder="Enter offer Banner Slogan" onChange={(e) => setBannerData({ ...bannerData, bannertext: e.target.value })} value={bannerData?.bannertext}>
                                    </textarea>
                                </div>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label htmlFor="bannerCode" className="fieldTitle">
                                                Offer PromoCode<span>*</span>
                                            </label>
                                            <input onChange={(e) => setBannerData({ ...bannerData, bannercode: e.target.value.toUpperCase() })} value={bannerData?.bannercode} id="bannerCode" type="text" placeholder="Enter Offer Promocode" />
                                        </div>
                                        <div className="subFormField">
                                            <label htmlFor="discount" className="fieldTitle">
                                                Offer Discount (In Percentage)<span>*</span>
                                            </label>
                                            <input value={bannerData?.discount} onChange={(e) => setBannerData({ ...bannerData, discount: e.target.value })} id="discount" type="number" placeholder="Enter Discount Percentage" />
                                        </div>
                                    </div>
                                </div>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label htmlFor="startDate">
                                                Offer Start Date<span>*</span>
                                            </label>
                                            <input onChange={(e) => setBannerData({ ...bannerData, startdate: e.target.value })} value={bannerData?.startdate} id="startDate" type="date" />
                                        </div>
                                        <div className="subFormField">
                                            <label htmlFor="endDate">
                                                Offer End Date<span>*</span>
                                            </label>
                                            <input onChange={(e) => setBannerData({ ...bannerData, enddate: e.target.value })} value={bannerData?.enddate} id="endDate" type="date" />
                                        </div>
                                    </div>
                                </div>

                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button className='submit' onClick={updateBanner}>
                                    Update <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                            </form>
                        </div>
                }
            </div>
        </div>
    )
}

export default AdminBannerUpdate;