import Course from '../models/course.model.js';
import { courseValidator } from '../services/course.validator.js';
import { catchError } from '../services/error.middleware.js';

export class Courses {
    async createCourse(req, res) {
        try {
            const { error, value } = courseValidator.validate(req.body);
            if (error) throw new Error(error.details[0].message);

            const { title, description, teacher } = value;

            const newCourse = await Course.create({
                title,
                description,
                teacher
            });

            res.status(200).json({
                statusCode: 200,
                message: 'Course created successfully',
                data: newCourse
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async getAllCourses(req, res) {
        try {
            const courses = await Course.find();
            res.status(200).json({
                statusCode: 200,
                message: 'Courses retrieved successfully',
                data: courses
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async getCourseById(req, res) {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) throw new Error('Course not found');

            res.status(200).json({
                statusCode: 200,
                message: 'Course found',
                data: course
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async updateCourseById(req, res) {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) throw new Error('Course not found');

            const updatedCourse = await Course.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            res.status(200).json({
                statusCode: 200,
                message: 'Course updated successfully',
                data: updatedCourse
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async deleteCourseById(req, res) {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) throw new Error('Course not found');

            await Course.findByIdAndDelete(req.params.id);

            res.status(200).json({
                statusCode: 200,
                message: 'Course deleted successfully',
                data: {}
            });
        } catch (error) {
            catchError(error, res);
        }
    }

}
