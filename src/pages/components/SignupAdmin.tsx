import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebaseConfig";
import Image from "next/image";

const SignupAdmin = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [storage, setStorage] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    setStorage(storage);
  }, []);
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const avatarImage = event.target.avatarImage.files[0];
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const occupation = event.target.occupation.value;
    const mobile = event.target.mobile.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    try {
      const imageURL = uploadedImage;

      const response = await axios.post("/api/SignupAdmin", {
        avatarImage: imageURL,
        firstName,
        lastName,
        occupation,
        mobile,
        email,
        password,
      });
      if (response.status === 200) {
        const data = response.data;
        console.log("Signup response:", data);
        if (data.status === 1) {
          console.log("Signup successful:", data);
          router.push("/components/SendEmail");
        } else {
          setErrorMessage(data.message);
        }
      } else {
        console.log("Signup failed:", response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Signup failed. Please try again later.");
      }
    }
  };
  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, "images/" + file.name);

    try {
      await uploadBytes(storageRef, file);
      console.log("Image uploaded to Firebase Storage");
      const downloadURL = await getDownloadURL(storageRef);
      setUploadedImage(downloadURL);
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign Up to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Picture
                  </label>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      name="avatarImage"
                      id="avatarImage"
                      multiple
                      onChange={handleImageUpload}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-3/4 p-2.5 mt-1 dark:bg-gray-700 dark:border-gray-600  float-right dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Add Image"
                    />

                    {uploadedImage ? (
                      <Image
                        src={uploadedImage}
                        alt="Uploaded Image"
                        className="w-14 h-14 object-cover rounded-full inline-block mr-2"
                        width={56}
                        height={56}
                      />
                    ) : (
                      <Image
                        src="/avatar.png"
                        alt="Default Avatar"
                        className="w-14 h-14 object-cover rounded-full inline-block mr-2"
                        width={56}
                        height={56}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter Your First Name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter Your Last Name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="occupation"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter Your Occupation"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="mobile"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="number"
                    name="mobile"
                    id="mobile"
                    className="appearance-none  bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your Mobile Number"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Email
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

                <button
                  type="submit"
                  className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign up
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupAdmin;
