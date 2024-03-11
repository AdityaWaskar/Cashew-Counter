import React, { useState } from "react";
import "./addW.css";
import "../../index.css";
import services from "../../backend/backend";
import { useDispatch } from "react-redux";
import { addWorker } from "../../store/workerSlice";
import Loading from "../loading/Loading";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toaster from "../tosterFunctions/toaster";

const genders = ["Select", "Male", "Female", "Other"];
const AddWorker = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState(genders[0]);
  const [address, setAddress] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [nameValidate, setNameValidate] = useState(true);

  const onChangedEvent = (setMethod, value, elemnetName) => {
    setMethod(value);
    validation(elemnetName);
  };

  const validation = (element) => {
    // return true if input is right
    if (element === "name")
      return name.length === 0 || /^[A-Za-z\s]+$/.test(name);

    if (element === "age")
      return (
        age.length === 0 || (/^[0-9]+$/.test(age) && +age >= 18 && +age < 100)
      );

    if (element === "phoneNo")
      return (
        phoneNo.length === 0 ||
        (/^[0-9]+$/.test(phoneNo) && phoneNo.length === 10)
      );

    if (element === "address")
      return address.length === 0 || /^[A-Za-z0-9\s/,]+$/.test(address);

    // for gender validation
    return !(address.length > 0 && gender === genders[0]);
  };

  const clearStates = () => {
    setName("");
    setAge("");
    setPhoneNo("");
    setGender(genders[0]);
    setAddress("");
  };
  const onsubmitEvent = async () => {
    if (name === 0 || !validation("name"))
      return Toaster.showError("Name should be valid !");
    if (age === 0 || !validation("age"))
      return Toaster.showError("Age should be between range 18 to 100 !");
    if (phoneNo == 0 || !validation("phoneNo"))
      return Toaster.showError("Phone Number should be valid !");
    if (gender == genders[0] || !validation("gender"))
      return Toaster.showError("Select the gender !");
    if (address == 0 || !validation("address"))
      return Toaster.showError("Address should be valid !");

    try {
      setisLoading(true);
      let currentDate = new Date();

      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
      const year = currentDate.getFullYear();

      currentDate = `${day}-${month}-${year}`;
      const count = await services.workerCount();
      const data = {
        id: count + 1,
        name: name,
        age: age,
        phoneNo: phoneNo,
        gender: gender,
        address: address,
        DOR: currentDate,
        total: parseInt(0),
      };
      const response = await services.add(data);
      if (response === "Worker Added") {
        dispatch(addWorker(data));
        clearStates();
        Toaster.showMsg("Worker added successfully", "bottom-right", 2000);
      } else {
        // Handle unexpected response
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error, show error message or take appropriate action
      Toaster.showError(
        "An error occurred. Please try again later.",
        "bottom-right",
        2000
      );
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div id="addWorkerContainer" className="flex">
      <Loading isLoading={isLoading} />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Slide
      />
      <div className="form">
        <div className="title">New Worker</div>
        <div className="subContainer">
          <div className="row">
            <div className="inputField" id="nameField">
              <label>Name</label>
              <input
                onChange={(e) => onChangedEvent(setName, e.target.value)}
                value={name}
                type="text"
                placeholder="eg. Aditya Waskar"
              />
              {!validation("name") && (
                <span>*not contain special characters or numbers.</span>
              )}
            </div>
          </div>
          <div className="row">
            <div className="inputField" id="age">
              <label>Age</label>
              <input
                name={age}
                onChange={(e) => onChangedEvent(setAge, e.target.value)}
                type="text"
                placeholder="eg. 30"
              />
              {!validation("age") && (
                <span>*Only contans numbers & between range 18 to 100.</span>
              )}
            </div>
            <div className="inputField" id="phoneNo">
              <label>Phone No.</label>
              <input
                value={phoneNo}
                onChange={(e) => onChangedEvent(setPhoneNo, e.target.value)}
                maxLength={10}
                placeholder="xxxxxxx909"
                type="text"
              />
              {!validation("phoneNo") && <span>*enter valid phone no.</span>}
            </div>
          </div>
          <div className="row">
            <div className="inputField" id="genderField">
              <label>Gender</label>
              <select
                name="gender"
                id="gender"
                onChange={(e) => onChangedEvent(setGender, e.target.value)}
                value={gender}
              >
                {genders.map((g, index) => (
                  <option key={g + index} value={g} className={g}>
                    {g}
                  </option>
                ))}
              </select>
              {!validation() && <span>*select gender</span>}
            </div>
          </div>
          <div className="row">
            <div className="inputField" id="addressField">
              <label>Address</label>
              <textarea
                value={address}
                onChange={(e) => onChangedEvent(setAddress, e.target.value)}
                name="address"
                id="addresss"
                rows="10"
                placeholder="eg. Mumbai"
              />
              {!validation("address") && (
                <span>*not contain special characters or numbers.</span>
              )}
            </div>
          </div>

          <div className="row">
            <button onClick={onsubmitEvent}>ADD</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorker;
