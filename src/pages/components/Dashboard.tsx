import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface UserData {
  _id: string;
  avatarImage: string;
  firstName: string;
  lastName: string;
  occupation: string;
  mobile: number;
  email: string;
  password: string;
}

const Dashboard = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [userData, setUserData] = useState<UserData | null>(null);
  // console.log("router.query", router.query);
  const fetchUserData = async () => {
    // debugger
    try {
      const response = await axios.get(`/api/GetUserData?userId=${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const sendPDFemail = async ()=>{
    // debugger
    try {
      const response = await axios.get(`/api/GetDataPDF?userId=${userId}`);
      console.log("/api/GetDataPDF?userId",response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);
  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen  lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 min-w-fit">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                User Detail
              </h1>
              <hr />
              <div className="flex flex-row gap-6 justify-center ">
                <Image
                  className="rounded-full w-48 h-48"
                  src={userData?.avatarImage}
                  alt="image description"
                  width={192}
                  height={192}
                />
                <div className="text-white text-3xl mt-4">
                  <h2>{userData?.firstName}</h2>
                  <h2>{userData?.lastName}</h2>
                  <h2 className="text-lg mt-4">{userData?.email}</h2>
                </div>
              </div>
              <div className="text-white text-xl mt-4 ">
                <h3 className="m-3">0{userData?.mobile}</h3>
                <h3 className="m-3">{userData?.occupation}</h3>
              </div>
            </div>
            <div className="text-gray-500 text-xl flex justify-between m-4 px-6">
              <Link
                href={`/components/CreatePartner?userId=${userId}`}
                className=" hover:underline dark:text-primary-500"
              >
                Create Partner
              </Link>
              <Link
                href={`/components/ViewPartners?userId=${userId}`}
                className=" hover:underline dark:text-primary-500"
              >
                View Partner
              </Link>
            </div>
            <div className="w-full flex justify-center p-10">
              <button onClick={()=>sendPDFemail()} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                Send Data as PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
