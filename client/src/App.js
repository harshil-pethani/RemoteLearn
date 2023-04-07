import React, { createContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import AboutPage from './Pages/AboutPage'
import ServicesPage from './Pages/ServicesPage'
import ContactPage from './Pages/ContactPage'
import DemoClassPage from './Pages/DemoClassPage'
import Referralpage from './Pages/Referralpage'
import UserDetailPage from './Pages/UserDetailPage'
import ScrollToTop from './Components/ScrollToTop'
import AdminLogin from './Pages/AdminLogin'
import AdminHistory from './Components/AdminHistory'
import AdminSettings from './Components/AdminSettings'
import AdminBannerUpdate from './Components/AdminBannerUpdate'
import AdminSingleCourse from './Components/AdminSingleCourse'
import AdminUpdateBatch from './Components/AdminUpdateBatch'
import AdminCreateBatch from './Components/AdminCreateBatch'
import ErrorPage from './Components/ErrorPage'
import { checkAdminApi, getAllCoursesApi } from './Config/Api'
import axios from 'axios'
import AdminTransactions from './Components/AdminTransactions'
import AdminStudents from './Components/AdminStudents'
import CheckoutSuccess from './Components/CheckoutSuccess'
import AdminReset from './Pages/AdminReset'
import AdminGlance from './Components/AdminGlance'
import AdminBannerCreate from './Components/AdminBannerCreate'
import AdminWaiting from './Components/AdminWaiting'
import AdminCreateCourse from './Components/AdminCreateCourse'
import AdminQuizSubmitted from './Components/AdminQuizSubmitted'
import AdminSingleQuizData from './Components/AdminSingleQuizData'

export const quizContext = createContext();
export const planContext = createContext();

const App = () => {
  // const cookies = new Cookies();

  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isNewUser, setIsNewUser] = useState(false);
  const [prevPlanIndex, setPrevPlanIndex] = useState(20);

  const [userSelectedCourse, setUserSelectedCourse] = useState(null);
  const [userSelectedBatch, setUserSelectedBatch] = useState(null);

  const [allCourses, setAllCourses] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("allcourses");
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  // const [allSlots, setAllSlots] = useState([]);

  const [adminLogged, setAdminLogged] = useState(false);
  const [adminDetails, setAdminDetails] = useState({});

  // console.log(allCourses);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const checkAdmin = await axios.get(checkAdminApi, { withCredentials: true });
        if (checkAdmin.status === 200) {
          setAdminLogged(true);
          setAdminDetails(checkAdmin.data.admin);
        }
      } catch (e) {
        setAdminLogged(false);
      }
    }
    const findCourses = async () => {
      try {
        const getAllCourses = await axios.get(getAllCoursesApi);
        if (getAllCourses.data.length > 0) {
          setAllCourses(getAllCourses.data);
        }
      } catch (e) {
        console.log(e);
      }
    }
    checkAdmin();
    findCourses();
  }, []);

  useEffect(() => {
    localStorage.setItem('allcourses', JSON.stringify(allCourses));
  }, [allCourses]);

  return (
    <quizContext.Provider value={{ quizCompleted, setQuizCompleted, quizAnswers, setQuizAnswers, isNewUser, setIsNewUser, setPrevPlanIndex, prevPlanIndex }}>
      <planContext.Provider value={{ allCourses, setAllCourses, userSelectedCourse, setUserSelectedCourse, userSelectedBatch, setUserSelectedBatch }}>
        <ScrollToTop>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/about" element={<AboutPage />} />
            <Route exact path="/services" element={<ServicesPage />} />
            <Route exact path="/contact" element={<ContactPage />} />
            <Route exact path="/demo-class" element={<DemoClassPage />} />
            <Route exact path="/referral" element={<Referralpage />} />
            <Route exact path="/services/userdetails" element={userSelectedCourse ? <UserDetailPage /> : <Navigate to="/services" />} />
            <Route exact path="/services/checkout-success/:planid/:batchid/:price" element={<CheckoutSuccess />} />


            <Route exact path="/admin" element={adminLogged ? <Navigate to="/admin/settings" /> : < AdminLogin setAdminDetails={setAdminDetails} setAdminLogged={setAdminLogged} />} />
            <Route exact path="/admin/reset_password" element={adminLogged ? <Navigate to="/admin/settings" /> : < AdminReset />} />
            <Route exact path="/admin/offerbanner" element={adminLogged ? <Navigate to="/admin/settings" /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/offerbanner/create" element={adminLogged ? <AdminBannerCreate setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/offerbanner/history" element={adminLogged ? <AdminHistory setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/offerbanner/history/:id" element={adminLogged ? <AdminBannerUpdate setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/course" element={adminLogged ? <Navigate to="/admin/course/createcourse" /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/course/createcourse" element={adminLogged ? <AdminCreateCourse setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/course/:id" element={adminLogged ? <AdminSingleCourse setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/course/:id/:slot" element={adminLogged ? <AdminUpdateBatch setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/course/:id/createslot" element={adminLogged ? <AdminCreateBatch setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/pendingcourses/:id" element={adminLogged ? <AdminSingleCourse setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/quizsubmitted" element={adminLogged ? <AdminQuizSubmitted setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/quizsubmitted/:id" element={adminLogged ? <AdminSingleQuizData setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/students" element={adminLogged ? <AdminStudents setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/waiting" element={adminLogged ? <AdminWaiting setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/transactions" element={adminLogged ? <AdminTransactions setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/at-a-glance" element={adminLogged ? <AdminGlance setAdminLogged={setAdminLogged} adminDetails={adminDetails} /> : <Navigate to="/admin" />} />
            <Route exact path="/admin/settings" element={adminLogged ? <AdminSettings setAdminLogged={setAdminLogged} adminDetails={adminDetails} setAdminDetails={setAdminDetails} /> : <Navigate to="/admin" />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </ScrollToTop>
      </planContext.Provider>
    </quizContext.Provider >
  )
}

export default App;