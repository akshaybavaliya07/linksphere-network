import { mailer } from '@/lib/mailer'
import VerifyOtpTemplate from '@/emails/verifyEmailTemplate'
import { ApiResponse } from '@/types/ApiResponse';
import { render } from '@react-email/render';

export const sendEmailVerification = async (email:string, name:string, otp:string): Promise<ApiResponse> => {

    const html = await render(<VerifyOtpTemplate name={name} otp={otp} />);

    try {
        const result = await mailer.sendMail({
            from: `LinkSphere <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify your LinkSphere account',
            html
        });

        return {
            success: true,
            message: 'Verification email sent successfully.',
        }
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            message: 'Failed to send verification email. Please try again later.',
        };
        
    }
}