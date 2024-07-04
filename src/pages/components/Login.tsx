import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post("/api/LoginUser", { email, password });
      // debugger;
      if (response.status === 200) {
        const data = response.data;
        console.log("Login response:", data);

        if (data.status === 1) {
          console.log("Login successful:", data);
          console.log("object",response.data.data.user.isAdmin);
          if(response.data.data.user.isAdmin===true) {
            router.push({
              pathname: `/components/Dashboard`,
              query: { userId: response.data.data.user._id },
            });
          }else if (response.data.data.user.isPartner===true){
            router.push({
              pathname: `/components/PartnerDashboard`,
              query: { userId: response.data.data.user._id },
            });
          }else{
            router.push({
              pathname: `/`,
              
            });
          }
          
        } else {
          setErrorMessage(data.message);
        }
      } else {
        console.log("Login failed:", response.data.message);
        setErrorMessage(response.data.message);
      }
      // if (response.status === 200) {
      //   const data = response.data;
      //   console.log("Login response:", data);
      
      //   if (data.status === 1) {
      //     console.log("Login successful:", data);
      //     router.push({
      //       pathname: `/components/Dashboard`,
      //       query: {
      //         userId: data.data.user._id,
      //         userModel: data.data.userModel
      //       },
      //     });
      //   } else {
      //     setErrorMessage(data.message);
      //   }
      // } else {
      //   console.log("Login failed:", response.data.message);
      //   setErrorMessage(response.data.message);
      // }
      
    } catch (error: any) {
      console.error("Error:", error.message);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Signup failed. Please try again later.");
      }
    }
  };
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <div className="flex gap-6 mt-3">
                    <Link
                      href="/components/SignupAdmin"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Sign up Admin
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
