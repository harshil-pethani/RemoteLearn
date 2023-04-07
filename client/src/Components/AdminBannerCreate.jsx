import React, { useState } from 'react'
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import axios from 'axios';
import { createBannerApi } from '../Config/Api';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const AdminBannerCreate = ({ adminDetails, setAdminLogged }) => {
    const [bannerData, setBannerData] = useState({ bannertext: "", startdate: "", enddate: "", bannercode: "", discount: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");

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

    const navigate = useNavigate();
    const handleCreate = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsLoading(true);
                const createBanner = await axios.post(createBannerApi, { ...bannerData, bannercode: bannerData.bannercode.toLowerCase() }, { withCredentials: true });
                if (createBanner?.status === 201) {
                    setIsLoading(false);
                    setIsError(false);
                    navigate("/admin/offerbanner/history");
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
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

    return (
        <div>
            <AdminTop adminDetails={adminDetails} />
            <div className="adminMainContent">
                <AdminSide adminDetails={adminDetails} setAdminLogged={setAdminLogged} />
                {
                    isLoading ?
                        <Loader adminLoader={true} /> :
                        <div className="adminBannerCreate right">
                            <h2 className="title">
                                Create New Offer Banner
                            </h2>
                            <form>
                                <div className="formField">
                                    <label className="fieldTitle" htmlFor="bannerMsg">
                                        Offer Banner Slogan<span>*</span>
                                    </label>
                                    <textarea value={bannerData.bannertext} onChange={(e) => { setBannerData({ ...bannerData, bannertext: e.target.value }) }} id="bannerMsg" placeholder="Enter offer Banner Slogan"></textarea>
                                </div>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label htmlFor="bannerCode" className="fieldTitle">
                                                Offer PromoCode<span>*</span>
                                            </label>
                                            <input value={bannerData.bannercode} onChange={(e) => { setBannerData({ ...bannerData, bannercode: e.target.value.toUpperCase() }) }} id="bannerCode" type="text" placeholder="Enter Offer Promocode" />
                                        </div>
                                        <div className="subFormField">
                                            <label htmlFor="discount" className="fieldTitle">
                                                Offer Discount (In Percentage)<span>*</span>
                                            </label>
                                            <input value={bannerData.discount} onChange={(e) => { setBannerData({ ...bannerData, discount: e.target.value }) }} id="discount" type="number" placeholder="Enter Discount Percentage" />
                                        </div>
                                    </div>
                                </div>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label htmlFor="startDate">
                                                Offer Start Date<span>*</span>
                                            </label>
                                            <input value={bannerData.startdate} onChange={(e) => { setBannerData({ ...bannerData, startdate: e.target.value }) }} id="startDate" type="date" />
                                        </div>
                                        <div className="subFormField">
                                            <label htmlFor="endDate">
                                                Offer End Date<span>*</span>
                                            </label>
                                            <input value={bannerData.enddate} onChange={(e) => { setBannerData({ ...bannerData, enddate: e.target.value }) }} id="endDate" type="date" />
                                        </div>
                                    </div>
                                </div>

                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button className='submit' onClick={handleCreate}>
                                    Create <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                            </form>
                        </div>
                }
            </div>
        </div>
    )
}

export default AdminBannerCreate