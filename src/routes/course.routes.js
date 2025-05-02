import express from 'express';
import { Courses } from '../controllers/course.controller.js';

const router = express.Router();
const courseController = new Courses();

router.post('/create-course', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourseById);
router.delete('/:id', courseController.deleteCourseById);

export default router;
