import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export const POST = async (req: Request) => {
    await dbConnect();

    try {
        const { email, code } = await req.json();
        console.log(email, code);

        const user = await UserModel.findOne({ email });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const isCodeValid = user.verificationCode === code;
        const isCodeExpired = new Date() > new Date(user.verificationCodeExpires);
        if (isCodeValid && !isCodeExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "Code verified successfully. User is now verified.",
                },
                {
                    status: 200,
                }
            );
        }

        return Response.json(
            {
                success: false,
                message: "Invalid or expired verification code.",
            },
            {
                status: 400,
            }
        );
        
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "An error occurred while verifying the code.",
            },
            {
                status: 500,
            }
        );
    }
}