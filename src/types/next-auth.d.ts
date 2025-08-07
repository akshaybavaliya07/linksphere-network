import {DefaultSession} from "next-auth";

declare module "next-auth" {
    interface User {
        _id: string;
        name: string;
        email: string;
        bio: string;
        isVerified: boolean;
    }

    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            bio: string;
            isVerified: boolean;
        };
    }

    interface JWT {
        id: string;
        name: string;
        email: string;
        bio: string;
        isVerified: boolean;
    }
}