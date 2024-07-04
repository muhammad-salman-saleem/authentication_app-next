import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const ConfirmationEmail = () => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const HandleConfirmEmail = async () => {
    const { email } = router.query;
    try {
      const response = await axios.get("/api/VerifyEmail", {
        params: {
          email: email,
        },
      });
      setIsVerified(true);
      console.log("response: " , response.data)
      router.push("/components/Login");
    } catch (error) {
      console.log("object");
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Confirm your email address
          </h1>
          <br />
          {isVerified ? (
            <p>User already verified</p>
          ) : (
            <button
              onClick={()=>HandleConfirmEmail()}
              className="w-1/4 text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Confirm Email
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default ConfirmationEmail;
