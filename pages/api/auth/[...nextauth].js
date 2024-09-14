import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import { mongooseConnect } from "@/lib/mongoose.js";
import User from "@/models/users";

const adminEmails = [
  "akashspandey2004@gmail.com",
  "akashspandey0601@gmail.com",
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session) {
        const user = await User.findOne({ email: session?.user?.email });
        if (user && user.isAdmin) {
          return session;
        } else {
          console.log("not authorised as admin.");
          return false;
        }
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        await mongooseConnect();
        if (profile?.email) {
          const isAdmin = adminEmails.includes(profile.email);
          const existingUser = await User.findOne({ email: profile.email });

          if (existingUser) {
            // Update existing user
            await User.updateOne(
              { email: profile.email },
              {
                $set: {
                  name: profile.name,
                  image: profile.image,
                  isAdmin,
                },
              }
            );
          } else {
            // Create new user
            await User.create({
              email: profile.email,
              name: profile.name,
              image: profile.image,
              isAdmin,
            });
          }
        }
        return true;
      } catch (error) {
        console.log("Error in signIn callback:", error);
        return false; // Return false if sign-in fails
      }
    },
  },
};
export default NextAuth(authOptions);
