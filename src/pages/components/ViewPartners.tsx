import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { RxSlash } from "react-icons/rx";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebaseConfig";

interface PartnersData {
  _id: string;
  avatarImage: string;
  firstName: string;
  lastName: string;
  mobile: number;
  email: string;
  is_verified: boolean;
  plan_access: boolean;
  plan_creation: boolean;
  admin_id: string;
  user_verification_code: number;
  isAdmin: boolean;
  isPartner: boolean;
  isDeveloper: boolean;
  data: any;
  adminData: {
    email: string;
    avatarImage: string;
    firstName: string;
    lastName: string;
  };
}
interface UpdatePartnersData {
  _id: string;
  avatarImage: string;
  firstName: string;
  lastName: string;
  mobile: number;
  email: string;
  plan_access: boolean;
  plan_creation: boolean;
  isAdmin: boolean;
  isPartner: boolean;
  isDeveloper: boolean;
}

const ViewPartners = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [partnersData, setPartnerData] = useState<PartnersData[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [PartnerUpdate, setPartnerUpdate] = useState<UpdatePartnersData>({
    _id: "",
    avatarImage: "",
    firstName: "",
    lastName: "",
    mobile: 0,
    email: "",
    plan_access: false,
    plan_creation: false,
    isAdmin: false,
    isPartner: false,
    isDeveloper: false,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [storage, setStorage] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    setStorage(storage);
  }, []);

  const fetchPartnersData = async () => {
    try {
      const response = await axios.get(`/api/GetPartnersData?userId=${userId}`);
      setPartnerData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const deletePartner = async (partnerId: string) => {
    try {
      const response = await axios.delete(
        `/api/GetPartnersData?userId=${partnerId}`
      );
      console.log("response", response);
      fetchPartnersData();
    } catch (error) {
      console.error(error);
    }
  };
  const showPopupWindow = async (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setShowPopup(true);

    const selectedPartner = partnersData.find(
      (partner) => partner._id === partnerId
    );

    setPartnerUpdate({
      _id: selectedPartner?._id || "",
      avatarImage: selectedPartner?.avatarImage || "",
      firstName: selectedPartner?.firstName || "",
      lastName: selectedPartner?.lastName || "",
      mobile: selectedPartner?.mobile || 0,
      email: selectedPartner?.email || "",
      plan_access: selectedPartner?.plan_access || false,
      plan_creation: selectedPartner?.plan_creation || false,
      isAdmin: selectedPartner?.isAdmin || false,
      isPartner: selectedPartner?.isPartner || false,
      isDeveloper: selectedPartner?.isDeveloper || false,
    });
  };

  const updatePartner = async (event:any) => {
    event.preventDefault(); 
  
    try {
      const response = await axios.patch(
        `/api/GetPartnersData?userId=${selectedPartnerId}`,
        PartnerUpdate
      );
      console.log("response.data", response.data);
      console.log("response.data.message", response.data.message);
      setPartnerUpdate(response.data.data);
      fetchPartnersData();
      if (response.data.status === 1) {
        setErrorMessage("");
        setShowPopup((prevShowPopup) => !prevShowPopup);
      }
      else {
        setErrorMessage(response.data.message);
      }
    } catch (error:any) {
      console.error("Error:", error.message);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Signup failed. Please try again later.");
      }
    }
  };
  

  useEffect(() => {
    if (userId) {
      fetchPartnersData();
    }
  }, [userId]);

  if (partnersData.length === 0) {
    return <p>Loading user data...</p>;
  }

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, "images/" + file.name);

    try {
      await uploadBytes(storageRef, file);
      console.log("Image uploaded to Firebase Storage");
      const downloadURL = await getDownloadURL(storageRef);
      setUploadedImage(downloadURL);
      setPartnerUpdate((prevPartnerUpdate) => ({
        ...prevPartnerUpdate,
        avatarImage: downloadURL,
      }));
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;

    if (type === "checkbox") {
      setPartnerUpdate((prevPartnerUpdate) => ({
        ...prevPartnerUpdate,
        [name]: checked,
      }));
    } else if (type === "radio") {
      if (name === "is_role") {
        setPartnerUpdate((prevPartnerUpdate) => ({
          ...prevPartnerUpdate,
          isAdmin: event.target.value === "admin",
          isPartner: event.target.value === "partner",
          isDeveloper: event.target.value === "developer",
        }));
      }
    } else {
      setPartnerUpdate((prevPartnerUpdate) => ({
        ...prevPartnerUpdate,
        [name]: value,
      }));
    }
  };

  const updatePartnerData = (PartnerUpdate: any) => {
    return (
      <>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-sm bg-black bg-opacity-30 ">
            <div className="dark:bg-gray-900 bg-gray-50 p-10 rounded-2xl">
              <div className="flex justify-center pb-6">
                <h2 className="text-gray-900 dark:text-white text-xl ">
                  Update Partner Data
                </h2>
              </div>

              <form
                className="space-y-4 md:space-y-6 "
                onSubmit={(event) => updatePartner(event)}
              >
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
                        src={PartnerUpdate.avatarImage}
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
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={PartnerUpdate.firstName}
                    onChange={(event) => handleInputChange(event)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter First Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={PartnerUpdate.lastName}
                    onChange={(event) => handleInputChange(event)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter Last Name"
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
                    value={`${PartnerUpdate.mobile}`}
                    onChange={(event) => handleInputChange(event)}
                    className="appearance-none  bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your Mobile Number"
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
                    value={PartnerUpdate.email}
                    onChange={(event) => handleInputChange(event)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="create_access"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Create Access
                  </label>
                  <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="plan_access"
                          type="checkbox"
                          name="plan_access"
                          onChange={(event) => handleInputChange(event)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          checked={PartnerUpdate?.plan_access || false}
                        />
                        <label
                          htmlFor="plan_access"
                          className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Plane Access
                        </label>
                      </div>
                    </li>
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="plan_creation"
                          type="checkbox"
                          name="plan_creation"
                          onChange={(event) => handleInputChange(event)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          checked={PartnerUpdate?.plan_creation || false}
                        />
                        <label
                          htmlFor="plan_creation"
                          className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Plane Creation
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <label
                    htmlFor="Role"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Role
                  </label>
                  <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="horizontal-list-radio-license"
                          type="radio"
                          value="admin"
                          name="is_role"
                          onChange={(event) => handleInputChange(event)}
                          checked={PartnerUpdate?.isAdmin}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="horizontal-list-radio-license"
                          className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Admin
                        </label>
                      </div>
                    </li>
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="horizontal-list-radio-id"
                          type="radio"
                          value="partner"
                          name="is_role"
                          onChange={(event) => handleInputChange(event)}
                          checked={PartnerUpdate?.isPartner}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="horizontal-list-radio-id"
                          className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Partner
                        </label>
                      </div>
                    </li>
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="horizontal-list-radio-millitary"
                          type="radio"
                          value="developer"
                          name="is_role"
                          onChange={(event) => handleInputChange(event)}
                          checked={PartnerUpdate?.isDeveloper}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="horizontal-list-radio-millitary"
                          className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Developer
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-between ">
                  <button
                    type="submit"
                    className="w-fit text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={(event) => updatePartner(event)}
                  >
                    Update Data
                  </button>
                  <button
                    type="submit"
                    className="w-fit text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={() => setShowPopup(false)}
                  >
                    Close Window
                  </button>
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </form>
            </div>
          </div>
        )}
      </>
    );
  };
  const partnersDataMap = partnersData.map((partner, index: number) => {
    return (
      <>
        <tr className="hover:bg-gray-50" key={index}>
          <td className="px-6 py-4">
            <div className="flex gap-3 ">
              <div className="relative h-10 w-10">
                {partner.adminData && partner.adminData.avatarImage ? (
                  <Image
                    className="h-full w-full rounded-full object-cover object-center"
                    src={partner.adminData.avatarImage}
                    alt=""
                    height={40}
                    width={40}
                  />
                ) : null}
                <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-700">
                  {partner.adminData && partner.adminData.firstName
                    ? partner.adminData.firstName
                    : ""}{" "}
                  {partner.adminData && partner.adminData.lastName
                    ? partner.adminData.lastName
                    : ""}
                </div>
                <div className="text-gray-400">
                  {" "}
                  {partner.adminData && partner.adminData.email
                    ? partner.adminData.email
                    : ""}{" "}
                </div>
              </div>
            </div>
          </td>
          {/* <td className="px-6 py-4">{partner.adminData.email}</td> */}
          <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">
            <div className="relative h-10 w-10">
              <Image
                className="h-full w-full rounded-full object-cover object-center"
                src={partner.avatarImage}
                alt=""
                height={40}
                width={40}
              />
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">
                {partner.firstName} {partner.lastName}
              </div>
              <div className="text-gray-400"> {partner.email} </div>
            </div>
          </td>
          <td className="px-6 py-4">0{partner.mobile}</td>
          <td className="px-6 py-4">
            {partner.isAdmin ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Admin
              </span>
            ) : partner.isPartner ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Partner
              </span>
            ) : partner.isDeveloper ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Developer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                {" "}
              </span>
            )}
          </td>
          <td className="px-6 py-4">
            {partner.is_verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Unverified
              </span>
            )}
          </td>
          {partner.user_verification_code ? (
            <td className="px-6 py-4">{partner.user_verification_code}</td>
          ) : (
            <td className="px-6 py-4">Null</td>
          )}
          <td className="px-6 py-4">
            {partner.plan_access ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                Access
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Not Access
              </span>
            )}
          </td>
          <td className="px-6 py-4">
            {partner.plan_creation ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                Access
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Not Access
              </span>
            )}
          </td>
          <td className="px-6 py-4 ">
            <div className="flex gap-3 justify-center">
              <BsPencilFill
                className="text-2xl cursor-pointer"
                onClick={() => showPopupWindow(partner._id)}
              />
              <RxSlash
                className="text-2xl cursor-pointer"
                data-modal-target="authentication-modal"
                data-modal-toggle="authentication-modal"
              />
              <AiTwotoneDelete
                className="text-2xl cursor-pointer"
                onClick={() => deletePartner(partner._id)}
              />
            </div>
          </td>
        </tr>
      </>
    );
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="col-span-12">
        <div className="overflow-auto lg:overflow-visible">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Created By
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Partner Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Mobile
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Role
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Verified
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Verification Code
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Plane Access
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Plane Creation
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Update and Delete
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium text-gray-900"
                ></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {partnersDataMap}
            </tbody>
          </table>
          {updatePartnerData(PartnerUpdate)}
        </div>
      </div>
    </div>
  );
};

export default ViewPartners;
