import NextAuth, { SessionOptions, User } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { AdapterUser } from "next-auth/adapters";
import { connectToDB } from "@/utils/database";
import Users from "@/models/user";

type UserType = {
    id: string,
    email: string,
    name: string,
    picture: string
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            checks: ['none']
        })
    ],
    callbacks: {
        async session({ session }) {
            const sessionUser = await Users.findOne({ email: session?.user?.email });
            
            if(session.user != undefined)
              session.user.id = sessionUser._id.toString();
      
            return session;
            
        },
        async signIn({ user }: {user: User | AdapterUser}) {
            try {
                await connectToDB();
        
                // check if user already exists
                const userExists = await Users.findOne({ email: user?.email });
        
                // if not, create a new document and save user in MongoDB
                if (!userExists) {
                  await Users.create({
                    email: user?.email,
                    username: user?.name?.replace(" ", "").toLowerCase(),
                    image: user?.image,
                  });
                }
        
                return true
              } catch (error) {
                console.log("Error checking if user exists: ", error);
                return false
              }
        },
    },
})

export {handler as GET, handler as POST};