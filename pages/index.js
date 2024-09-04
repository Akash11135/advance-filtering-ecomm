import Layout from "@/components/Layout";
import { useSession, signOut } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();

  return (
    <Layout>
      <button onClick={() => signOut("google")}>Sign Out</button>
      <div className="flex justify-between items-center">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300  rounded-lg overflow-hidden ">
          <img src={session?.user?.image} className="h-6 w-6" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
