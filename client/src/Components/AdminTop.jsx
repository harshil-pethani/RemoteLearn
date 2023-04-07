import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoImg from "../Assets/logo.png";

const AdminTop = ({ adminDetails }) => {
    const navigate = useNavigate();
    return (
        <div className="adminTop">

            <Link to="/admin" className="logo">
                <img src={logoImg} alt="" />
            </Link>
            <div className="profile" onClick={() => navigate("/admin/settings")}>
                <div className="userImage">
                    <ion-icon name="person"></ion-icon>
                </div>
                <h2 className="title">
                    {adminDetails.username}
                </h2>
            </div>
        </div>
    )
}

export default AdminTop