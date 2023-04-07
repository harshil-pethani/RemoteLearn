// const domain = "http://localhost:5000";
const domain = "";

// Auth API
export const registerApi = `${domain}/api/auth/register`;
export const loginApi = `${domain}/api/auth/login`;
export const logoutApi = `${domain}/api/auth/logout`;
export const forgotPassowrdApi = `${domain}/api/auth/forgotpassword`;
export const resetTokenVerify = `${domain}/api/auth/reset_token_verify`;
export const resetPasswordApi = `${domain}/api/auth/resetpassword`;
export const checkAdminApi = `${domain}/api/auth/checkadmin`;

// Admin Profile API
export const updateAdminDataApi = `${domain}/api/auth/updatedata`;
export const updatepasswordApi = `${domain}/api/auth/updatepassword`;

// Manage Admin API
export const getAllAdminApi = `${domain}/api/auth/alladmin`;
export const updateAdminStatus = (id) => `${domain}/api/auth/adminstatus/${id}`;
export const deleteFacultyApi = (id) => `${domain}/api/auth/deleteadmin/${id}`;

// Quiz API
export const quizSubmitApi = `${domain}/api/quiz/create`;
export const getQuizListApi = `${domain}/api/quiz/findall`;
export const getSingleQuizDataApi = (id) => `${domain}/api/quiz/find/${id}`;
export const deleteSingleQuizApi = (id) => `${domain}/api/quiz/delete/${id}`;

// Banner API
export const createBannerApi = `${domain}/api/banner/create`;
export const getAllBannerApi = `${domain}/api/banner/getallbanners`;
export const getSingleBannerApi = (id) => `${domain}/api/banner/find/${id}`;
export const updateBannerApi = (id) => `${domain}/api/banner/update/${id}`;
export const expireBannerApi = (id) => `${domain}/api/banner/expire/${id}`;
export const fetchActiveBannerApi = `${domain}/api/banner/findactive`;

// Course API
export const createCourseApi = `${domain}/api/course/create`;
export const getAllCoursesApi = `${domain}/api/course/findall`;
export const getAllCoursesOfFacultyApi = `${domain}/api/course/findalloffaculty`;
export const getSingleCourseApi = (id) => `${domain}/api/course/find/${id}`;
export const updateCourseApi = (id) => `${domain}/api/course/update/${id}`;
export const approveCourseApi = `${domain}/api/course/approvecourse`;
export const deleteCourseApi = (id) => `${domain}/api/course/delete/${id}`;
// export const getAllSlotApi = `${domain}/api/course/findallslots`;

// Batch API
export const createBatchApi = `${domain}/api/course/batch/create`;
export const getSingleBatchApi = (id) => `${domain}/api/course/batch/find/${id}`;
export const updateBatchApi = (id) => `${domain}/api/course/batch/update/${id}`;
export const deleteBatchApi = (id) => `${domain}/api/course/batch/delete/${id}`;

// Referral API
export const getReferralCodeApi = `${domain}/api/referral/getcode`;
export const checkReferralApi = `${domain}/api/referral/check`;
export const getFinalPriceApi = `${domain}/api/referral/getfinalprice`;

// Contact Form API
export const submitContactFormApi = `${domain}/api/contact/submitform`;

// Notification Alert API
export const createNotificationAlertApi = `${domain}/api/notify/create`;
export const getAllNotificationApi = `${domain}/api/notify/findall`;

// New Letter API
export const newsLetterSubscribeApi = `${domain}/api/subscribe/add`;

// Enrolled Students API
export const getAllStudentApi = `${domain}/api/student/findall`;
export const deleteStudentApi = (id) => `${domain}/api/student/${id}`;

// Bulk Mail API
export const sendBulkMailApi = `${domain}/api/student/sendbunkmail`;

// Transactions API
export const getAllTransactionsApi = `${domain}/api/transaction/findall`;

// Purchase API
export const checkoutApi = `${domain}/api/checkout/create-checkout-session`;
export const purchaseCohortZeroApi = `${domain}/api/checkout/zeroprice`;
export const getPurchasedCohortApi = `${domain}/api/checkout/purchasedcohort`;

// Glance API
export const getGlanceApi = `${domain}/api/glance`;
export const updateGlanceApi = (id) => `${domain}/api/glance/update/${id}`;

// "proxy": "",


