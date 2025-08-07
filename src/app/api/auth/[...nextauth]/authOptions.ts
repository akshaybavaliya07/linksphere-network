import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1️⃣ Credentials Provider (Custom Login Logic)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) throw new Error("User not found");

          if (!user.isVerified) {
            throw new Error(
              "User not verified. Please verify your account before logging in."
            );
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) throw new Error("Invalid password");

          return user;
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.name = user.name;
        token.email = user.email;
        token.bio = user.bio;
        token.isVerified = user.isVerified;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.bio = token.bio as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};
