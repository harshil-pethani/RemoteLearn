import React, { useEffect } from 'react'
import AdminSide from '../Components/AdminSide'
import AdminTop from '../Components/AdminTop'
import editBtn from "../Assets/editBtn.png";
import deleteBtn from "../Assets/deleteBtn.png";
import { useNavigate } from 'react-router-dom';
import { getDate } from '../Data';
import axios from 'axios';
import { expireBannerApi, getAllBannerApi } from '../Config/Api';
import { useState } from 'react';
import Loader from './Loader';

const AdminBannerHistory = ({ adminDetails, setAdminLogged }) => {
    const navigate = useNavigate();
    const [bannersData, setBannersData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [renderPage, setRenderPage] = useState(1);

    useEffect(() => {
        const getBanners = async () => {
            try {
                setIsLoading(true);
                const allBanners = await axios.get(getAllBannerApi, { withCredentials: true });
                if (allBanners.status === 200) {
                    setIsLoading(false);
                    setBannersData(allBanners.data.reverse());
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
        getBanners();
    }, [renderPage]);

    const expireBanner = async (bannerId) => {
        if (window.confirm("Are you sure to end this offer Right now ? ")) {
            try {
                setIsLoading(true);
                const res = await axios.put(expireBannerApi(bannerId), {}, { withCredentials: true })
                if (res.status === 200) {
                    setIsLoading(false);
                    setRenderPage(renderPage + 1);
                    // navigate("/admin");
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
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
                        <div className="adminBannerHistory right">
                            <h2 className="title">
                                Banner History
                            </h2>
                            {
                                bannersData.length > 0 ?
                                    <div className="tableDiv" style={{ overflow: "auto" }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Banner Text</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Status</th>
                                                    <th>Promo Code</th>
                                                    <th>Discount(%)</th>
                                                    <th>Edit</th>
                                                    <th>Stop</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    bannersData?.map((bannerData, index) => (
                                                        <tr key={index}>
                                                            <td className="bannerText">
                                                                {bannerData.bannertext}
                                                            </td>
                                                            <td>
                                                                {getDate(bannerData.startdate)}
                                                            </td>
                                                            <td>
                                                                {getDate(bannerData.enddate)}
                                                            </td>
                                                            <td className={bannerData.isrunning === true ? "status running" : "status completed"}>
                                                                {bannerData.isrunning === true ? 'Running' : 'Completed'}
                                                            </td>
                                                            <td className="promocode">
                                                                {bannerData.bannercode.toUpperCase()}
                                                            </td>
                                                            <td>
                                                                {bannerData.discount}%
                                                            </td>
                                                            <td className="edit">
                                                                <button onClick={() => navigate(`/admin/offerbanner/history/${bannerData._id}`)} disabled={bannerData.isrunning === false}>
                                                                    <img src={editBtn} alt="" />
                                                                </button>
                                                            </td>
                                                            <td className="end">
                                                                <button onClick={() => expireBanner(bannerData._id)} disabled={bannerData.isrunning === false}>
                                                                    <img src={deleteBtn} alt="" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>

                                        </table>
                                    </div>
                                    :
                                    <p className="noData">
                                        No Banner history Data available
                                    </p>
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default AdminBannerHistory