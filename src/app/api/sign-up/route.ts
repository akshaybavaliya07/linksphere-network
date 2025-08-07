import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/user.model"
import { sendEmailVerification } from "@/utils/sendEmailVerification"

export const POST = async (req: Request) => {
  await dbConnect();
  
  try {
    const { name, email, password } = await req.json();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Email already registered. Please use a different email.",
        },
        {
          status: 400,
        }
      );
    }

    const otp = JSON.stringify(Math.floor(100000 + Math.random() * 900000));

    const newUser = new UserModel({
      name,
      password,
      email,
      verificationCode: otp,
      verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    });

    await newUser.save();

    sendEmailVerification(newUser.email, newUser.name, otp);

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please check your email for verification.",
      },
      {
        status: 201,
      }
    ); 
  } catch (error) {
    console.error("Error while registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
};