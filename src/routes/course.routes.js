import express from 'express';
import { Courses } from '../controllers/course.controller.js';
import logger from '../library/logger.js';

const router = express.Router();
const courseController = new Courses();

router
    .get('/', async (req, res) => {
        logger.info('Post GET-search for /courses');
    });

router.post('/create-course', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourseById);
router.delete('/:id', courseController.deleteCourseById);

export default router;
