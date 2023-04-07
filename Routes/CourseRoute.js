import { Router } from 'express';
import { courseCreate, courseDelete, courseUpdate, getAllCourses, getAllBatches, getSingleCourse, getSingleBatch, batchCreate, batchDelete, batchUpdate, getAllCoursesOfFaculty, approveCourse } from '../Controllers/CourseController.js';
const router = Router();
import VerifyToken from "../Helper/VerifyToken.js";


// Course Routers
router.post("/create", VerifyToken, courseCreate.validator, courseCreate.controller);

router.get("/find/:id", getSingleCourse.validator, getSingleCourse.controller);

router.put("/update/:id", VerifyToken, courseUpdate.validator, courseUpdate.controller);

router.delete("/delete/:id", VerifyToken, courseDelete.validator, courseDelete.controller);

router.get("/findall", getAllCourses.controller);

router.get("/findalloffaculty", VerifyToken, getAllCoursesOfFaculty.controller);

router.post("/approvecourse", VerifyToken, approveCourse.controller);



// Batch Routers
router.post("/batch/create", VerifyToken, batchCreate.validator, batchCreate.controller);

router.get("/batch/find/:id", VerifyToken, getSingleBatch.validator, getSingleBatch.controller);

router.put("/batch/update/:id", VerifyToken, batchUpdate.validator, batchUpdate.controller);

router.post("/batch/delete/:id", VerifyToken, batchDelete.validator, batchDelete.controller);




// router.get("/findallbatches", getAllBatches.controller);

export default router;