import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface partnerData {
  _id: string;
  avatarImage: string;
  firstName: string;
  lastName: string;
  mobile: number;
  email: string;
  plan_access: boolean;
  plan_creation: boolean;
}
const PartnerDashboard = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [partnerData, setPartnerData] = useState<partnerData | null>(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      // debugger;
      try {
        const response = await axios.get(
          `/api/GetSinglePartnerData?userId=${userId}`
        );
        setPartnerData(response.data);
        console.log("response.data.isPartner", response.data.isPartner);
      } catch (error) {
        console.error(error);
      }
    };
    if (userId) {
      fetchPartnerData();
    }
  }, [userId]);
  if (!partnerData) {
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
                  src={partnerData?.avatarImage}
                  alt="image description"
                  width={192}
                  height={192}
                />
                <div className="text-white text-3xl mt-4">
                  <h2>{partnerData?.firstName}</h2>
                  <h2>{partnerData?.lastName}</h2>
                  <h2 className="text-lg mt-4">{partnerData?.email}</h2>
                </div>
              </div>
              <div className="text-white text-xl mt-4 ">
                <h3 className="m-3">0{partnerData?.mobile}</h3>
              </div>
            </div>
            <div className="text-gray-500 text-xl flex justify-between m-4 px-6">
  {partnerData.plan_creation && !partnerData.plan_access ? (
    <Link
      href={`/components/PlaneCreation?userId=${userId}`}
      className="hover:underline dark:text-primary-500"
    >
      Plane Creation
    </Link>
  ) : null}

  {!partnerData.plan_creation && partnerData.plan_access ? (
    <Link
      href={`/components/PlaneAccess?userId=${userId}`}
      className="hover:underline dark:text-primary-500"
    >
      Plane Access
    </Link>
  ) : null}

  {partnerData.plan_creation && partnerData.plan_access ? (
    <>
      <Link
        href={`/components/PlaneCreation?userId=${userId}`}
        className="hover:underline dark:text-primary-500"
      >
        Plane Creation
      </Link>
      <Link
        href={`/components/PlaneAccess?userId=${userId}`}
        className="hover:underline dark:text-primary-500"
      >
        Plane Access
      </Link>
    </>
  ) : null}

  {!partnerData.plan_creation && !partnerData.plan_access ? (
    <p>You do not have access to any service.</p>
  ) : null}
</div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerDashboard;
