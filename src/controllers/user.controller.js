import bcrypt from 'bcrypt';
import Joi from 'joi';
import User from '../models/user.model.js';
import { otpGenerator } from '../library/otp-generator.js';
import { getCache, setCache } from '../library/cache.js';
import { refTokenWriteCookie } from '../library/write-cookie.js';
import { catchError } from '../services/error.middleware.js';

export class UserController {
    async createUser(req, res) {
        try {
            const { error, value } = Joi.object({
                email: Joi.string().email().required(),
                name: Joi.string().min(3).required(),
                password: Joi.string().min(6).required(),
            }).validate(req.body);

            if (error) throw new Error(error.details[0].message);

            const { email, name, password } = value;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, name, password: hashedPassword });

            res.status(200).json({
                statusCode: 200,
                message: 'User created successfully',
                data: newUser
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async signInUser(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return catchError(res, 404, 'User not found');
            }
            const isMatchPassword = await decode(password, admin.hashedPassword);
            if (!isMatchPassword) {
                return catchError(res, 400, 'Invalid password');
            }
            const otp = otpGenerator();
            const mailMessage = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: 'couser-api',
                text: otp,
            };

            transporter.sendMail(mailMessage, function (err, info) {
                if (err) {
                    console.log(`Error on sending to mail: ${err}`);
                    return catchError(res, 400, err);
                } else {
                    console.log(info);
                    setCache(admin.username, otp);
                }
            });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {},
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async confirmSigninUser(req, res) {
        try {
            const { username, otp } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return catchError(res, 404, 'User not found');
            }
            const otpCache = getCache(username);
            if (!otpCache || otp != otpCache) {
                return catchError(res, 400, 'OTP expired');
            }
            const payload = { id: user._id, role: user.role };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            refTokenWriteCookie(res, 'refreshTokenUser', refreshToken);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: accessToken,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: users
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) throw new Error('User not found');

            res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: user
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async updateUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) throw new Error('User not found');

            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedUser
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async deleteUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) throw new Error('User not found');

            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            });
        } catch (error) {
            catchError(error, res);
        }
    }
}
