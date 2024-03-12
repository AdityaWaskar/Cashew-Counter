import React, { useState } from "react";
import "./addCashew.css";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import services from "../../backend/backend";
import { RxUpdate } from "react-icons/rx";
import {
  addCashew,
  addIndividualCashew,
  getWorkerList,
  updateTotalCashewValue,
} from "../../store/workerSlice";
import { ToastContainer } from "react-toastify";
import Toaster from "../tosterFunctions/toaster";
import Loading from "../loading/Loading";
import profile from "../../assets/profile.png";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AddCashew = () => {
  const { workerList, workerListByCashew } = useSelector(
    (state) => state.workers
  );
  const [date, setDate] = useState(new Date());
  const [cashewValue, setCahewValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [workers, setWorkers] = useState(workerList);
  const dispatch = useDispatch();

  const formatDate = (date) => {
    // Format the date as dd-mm-yyyy
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const onChangedEvent = (selectedDate) => {
    setDate(new Date(selectedDate));
  };

  const onClickedEvent = async (id, oldTotal) => {
    let currYear = date.getFullYear();
    let currMonth = date.getMonth() + 1;
    let currDate = date.getDate();
    let currFullDate = `${currDate}-${currMonth}-${currYear}`;
    setIsLoading(true);
    try {
      const data = { value: cashewValue, date: currFullDate };

      await services.addCashew(id, data, oldTotal);
      const cashewVal = await services.getCashewById(id);
      dispatch(updateTotalCashewValue({ id, value: cashewVal }));

      let cashewData = {};
      let monthlyCasData = {};
      let yearlyCasData = {};
      cashewData[currFullDate] = cashewValue;
      monthlyCasData[currMonth] = cashewData;
      yearlyCasData[currYear] = monthlyCasData;
      dispatch(
        addIndividualCashew({
          id,
          month: months[currMonth - 1],
          date: currDate,
          fullDate: currFullDate,
          year: currYear,
          data: cashewValue,
        })
      );

      setIsLoading(false);
      Toaster.showMsg(
        "Cashew count updated successfully !",
        "bottom-right",
        2000
      );
      setCahewValue(0);
      document.getElementById(id).value = "";
      // console.log(response);
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred:", error);
      Toaster.showError(
        "An error occurred. Please try again later.",
        "bottom-right",
        2000
      );
      // Handle the error appropriately, e.g., show a message to the user, log it, etc.
    }
  };

  const searchFunction = (searchText) => {
    setSearchText(searchText);
    if (searchText.length === 0) {
      setWorkers(workerList);
      return;
    }

    const searchArray = Object.values(workerList).filter((worker) => {
      return worker?.name.toLowerCase().includes(searchText.toLowerCase());
    });

    setWorkers(searchArray);
  };

  return (
    <div id="addCashewContainer" className="flex">
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
      <div className="subContainer">
        <div className="searchField">
          <IoSearch size={25} />
          <input
            type="search"
            value={searchText}
            onChange={(e) => searchFunction(e.target.value)}
          />
        </div>
        <div className="dateFilter">
          <input
            type="date"
            name="date"
            id="date"
            value={formatDate(date)}
            // max={date}
            max={formatDate(new Date())}
            onChange={(e) => onChangedEvent(e.target.value)}
          />
        </div>
        <div className="workerTable">
          <div className="tr">
            <div className="th td"></div>
            <div className="th td">Name</div>
            <div className="th td">Sex</div>
            <div className="th td">Phone No.</div>
            <div className="th td">Cashew(Kg)</div>
            <div className="th td">Cashew(Kg)</div>
          </div>
          <div className="tbody">
            {/* {workers?.map((w, index) => ( */}
            {Object.values(workers).map((worker, index) => (
              <div className="tr" key={worker?.phoneNo + index}>
                <div className="td">
                  <img src={profile} alt="" />
                </div>
                <div className="td">{worker?.name}</div>
                <div className="td">{worker?.gender}</div>
                <div className="td">{worker?.phoneNo}</div>
                <div className="td removeBtn">
                  <input
                    type="number"
                    name=""
                    id={worker?.id}
                    onChange={(e) => setCahewValue(e.target.value)}
                  />
                </div>
                <div className="td updateBtn flex">
                  <button
                    className="flex"
                    onClick={() => onClickedEvent(worker.id)}
                  >
                    <RxUpdate size={20} id={"rotateIcon"} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCashew;
