import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getAllTransactionsApi } from '../Config/Api';
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import Loader from './Loader';
import { ExportJsonCsv } from 'react-export-json-csv';

const AdminTransactions = ({ adminDetails, setAdminLogged }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [transactionData, setTransactionData] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const [yearSelect, setYearSelect] = useState([]);
    const [monthSelect, setMonthSelect] = useState([]);

    const [csvData, setCsvData] = useState([]);

    const headers = [
        {
            key: 'id',
            name: 'ID',
        },
        {
            key: 'createdAt',
            name: 'Order Date',
        },
        {
            key: 'customerid',
            name: 'Customer-id',
        },
        {
            key: 'username',
            name: 'Username',
        },
        {
            key: 'email',
            name: 'Email',
        },
        {
            key: 'coursename',
            name: 'Course Name',
        },
        {
            key: 'batch',
            name: 'Course Batch',
        },
        {
            key: 'promocode',
            name: 'Promocode',
        },
        {
            key: 'promocodetype',
            name: 'Promocode Type',
        },
        {
            key: 'price',
            name: 'Price',
        },
        {
            key: 'discount',
            name: 'Discount',
        },
        {
            key: 'total',
            name: 'Total',
        },
        {
            key: 'paymentIntentId',
            name: 'PaymentIntentId',
        },
        {
            key: 'payment_status',
            name: 'Payment Status',
        }
    ]

    useEffect(() => {
        const size = filteredTransactions.length;
        let tempData = [];

        for (let i = 0; i < size; i++) {
            tempData.push({ id: i, ...filteredTransactions[i] })
        }
        setCsvData(tempData);
        // console.log(tempData);
    }, [filteredTransactions]);

    const [dropDownActive, setDropDownActive] = useState("");

    const [filters, setFilters] = useState({ yearFilter: "Year", monthFilter: "Month" });

    useEffect(() => {
        const getTransactions = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(getAllTransactionsApi, { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    setTransactionData(res.data.reverse());
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
        getTransactions();
    }, []);

    useEffect(() => {
        setFilteredTransactions(transactionData);
        const Years = new Set(transactionData.map((trans) => new Date(trans.createdAt).getFullYear()));
        const Months = new Set(transactionData.map((trans) => new Date(trans.createdAt).getMonth() + 1));
        setYearSelect(["Year", ...Years]);
        setMonthSelect(["Month", ...Months]);
    }, [transactionData]);

    const handleFilter = (name, value) => {
        setFilters({
            ...filters,
            [name]: value
        })
    }

    useEffect(() => {
        setFilteredTransactions(
            transactionData.filter((trans) =>
                Object.entries(filters).every(([key, value]) => {
                    if (key === "yearFilter" && value !== "Year")
                        return new Date(trans.createdAt).getFullYear() === value;
                    else if (key === "monthFilter" && value !== "Month")
                        return new Date(trans.createdAt).getMonth() + 1 === value;
                    else
                        return true;
                })
            )
        )
    }, [filters])

    return (
        <div>
            <AdminTop adminDetails={adminDetails} />
            <div className="adminMainContent">
                <AdminSide adminDetails={adminDetails} setAdminLogged={setAdminLogged} />
                {
                    isLoading ?
                        <Loader adminLoader={true} /> :
                        <div className="adminStudents right">
                            <h2 className="title">
                                Transaction History
                            </h2>
                            <div className="filterContainer">
                                {
                                    transactionData.length > 0 &&
                                    <div className="filter">
                                        <span className="filterText">
                                            Filter Customers :
                                        </span>
                                        <div className="dropDown">
                                            <div onClick={() => { (dropDownActive === "yearDropdown") ? setDropDownActive("") : setDropDownActive("yearDropdown") }} className="dropDown-Btn">
                                                {filters.yearFilter}
                                                <ion-icon name="caret-down-outline"></ion-icon>
                                            </div>
                                            {
                                                (dropDownActive === "yearDropdown") &&
                                                <div className="dropDown-content">
                                                    {
                                                        yearSelect.map((curSelect, index) => {
                                                            return (
                                                                <div key={"select" + index} onClick={() => {
                                                                    handleFilter("yearFilter", curSelect);
                                                                    setDropDownActive("");
                                                                }} className="dropDown-item">
                                                                    {curSelect}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div>
                                        <div className="dropDown">
                                            <div onClick={() => { (dropDownActive === "monthDropdown") ? setDropDownActive("") : setDropDownActive("monthDropdown") }} className="dropDown-Btn">
                                                {filters.monthFilter}
                                                <ion-icon name="caret-down-outline"></ion-icon>
                                            </div>
                                            {
                                                (dropDownActive === "monthDropdown") &&
                                                <div className="dropDown-content">
                                                    {
                                                        monthSelect.map((curSelect, index) => {
                                                            return (
                                                                <div key={"select" + index} onClick={() => {
                                                                    handleFilter("monthFilter", curSelect);
                                                                    setDropDownActive("");
                                                                }} className="dropDown-item">
                                                                    {curSelect}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                                {
                                    filteredTransactions.length > 0 &&
                                    <ExportJsonCsv className="exportBtn" headers={headers} items={csvData}>Export</ExportJsonCsv>
                                }
                            </div>

                            <div className="tableDiv" style={{ overflow: "auto" }}>
                                {
                                    filteredTransactions.length > 0 ?
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Order Date</th>
                                                    <th>Customer-id</th>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Course Name</th>
                                                    <th>Course Batch</th>
                                                    <th>Promocode</th>
                                                    <th>Promocode Type</th>
                                                    <th>Price</th>
                                                    <th>Discount</th>
                                                    <th>Total</th>
                                                    <th>PaymentIntentId</th>
                                                    <th>Payment Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredTransactions?.map((trans, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {new Date(trans.createdAt).toDateString()}
                                                            </td>
                                                            <td>
                                                                {trans.customerid}
                                                            </td>
                                                            <td>
                                                                {trans.username}
                                                            </td>
                                                            <td>
                                                                {trans.email}
                                                            </td>
                                                            <td>
                                                                {trans.coursename}
                                                            </td>
                                                            <td>
                                                                {trans.batch}
                                                            </td>
                                                            <td>
                                                                {trans.promocode}
                                                            </td>
                                                            <td>
                                                                {trans.promocodetype}
                                                            </td>
                                                            <td>
                                                                {trans.price}
                                                            </td>
                                                            <td>
                                                                {trans.discount}
                                                            </td>
                                                            <td>
                                                                {trans.total}
                                                            </td>
                                                            <td>
                                                                {trans.paymentIntentId}
                                                            </td>
                                                            <td>
                                                                {trans.payment_status}
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>

                                        </table>
                                        :
                                        <p className="noData">
                                            No Transaction Data Available
                                        </p>
                                }
                            </div>
                        </div>
                }
            </div>
        </div >
    )
}

export default AdminTransactions