import nodemailer from 'nodemailer';

export const sendOtp = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'mail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transporter.sendMail({
        from: `Course App <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    });

    return info;
};