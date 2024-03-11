import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import WorkerTable from "../workerTable/WorkerTable";
import "./all.css";
import "../remove_worker/removeW.css";
import { useSelector } from "react-redux";
import { FaArrowUpLong } from "react-icons/fa6";

const AllWorker = () => {
  const { workerList } = useSelector((state) => state.workers);
  const [indicator, setIndicator] = useState("");
  const [workers, setWorkers] = useState(Object.values(workerList));
  const [searchText, setSearchText] = useState("");
  // Function to convert date string to a format sortable by JavaScript
  const toDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };
  const onChangeEvent = (indicatorName) => {
    setIndicator(indicatorName);
    let sortedData = workers;
    switch (indicatorName) {
      case "date":
        sortedData.sort((a, b) => toDate(a.DOR) - toDate(b.DOR)); // Sort the copy
        break;
      case "name":
        sortedData.sort((a, b) => a.name.localeCompare(b.name)); // Sort the copy by name
        break;
      case "cashewIncrement":
        sortedData.sort((a, b) => b.total - a.total);
        break;
      case "cashewDecrement":
        sortedData.sort((a, b) => a.total - b.total);
        break;
      case "clear":
        break;
      default:
        break;
    }
    setWorkers(sortedData);
  };
  const searchFunction = (searchtext) => {
    setSearchText(searchtext);
    if (searchtext.length === 0) {
      setWorkers(Object.values(workerList));
      return;
    }

    const searchArray = Object.values(workerList).filter((worker) =>
      worker.name.toLowerCase().includes(searchtext.toLowerCase())
    );
    setWorkers(searchArray);
  };
  return (
    <div id="allWorkerContainer" className="flex">
      <div className="subContainer">
        <div className="searchField">
          <IoSearch size={25} />
          <input
            type="search"
            value={searchText}
            onChange={(e) => searchFunction(e.target.value)}
          />
        </div>
        <div className="filters">
          <span
            className={indicator === "date" ? "active" : null}
            onClick={() => onChangeEvent("date")}
          >
            date
          </span>
          <span
            className={indicator === "name" ? "active" : null}
            onClick={() => onChangeEvent("name")}
          >
            name
          </span>
          <span
            className={
              indicator === "cashewIncrement"
                ? "active cashewIndi"
                : "cashewIndi"
            }
            onClick={() => onChangeEvent("cashewIncrement")}
          >
            <div>cashew</div>
            <FaArrowUpLong className="logo" size={13} />
          </span>
          <span
            className={
              indicator === "cashewDecrement"
                ? "active cashewIndi"
                : "cashewIndi"
            }
            onClick={() => onChangeEvent("cashewDecrement")}
          >
            <div>cashew</div>
            <FaArrowUpLong size={13} />
          </span>
          <span
            className={indicator === "clear" ? null : "cashewIndi"}
            onClick={() => onChangeEvent("clear")}
          >
            <div>clear filters</div>
          </span>
        </div>
        <WorkerTable workerTable={workers} remove={false} />
      </div>
    </div>
  );
};

export default AllWorker;
