import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/Nav";

export default function Layout({ children }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <div className=" text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white text-black p-2 rounded-sm"
          >
            Login with google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-bgGray min-h-screen flex">
      <Nav />
      <div className="bg-white text-black flex-grow m-2 ml-0 rounded-lg p-2">
        {children}
      </div>
    </div>
  );
}
