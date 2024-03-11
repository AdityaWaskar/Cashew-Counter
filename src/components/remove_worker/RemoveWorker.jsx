import React, { useEffect, useState } from "react";
import "./removeW.css";
import "../../index.css";
import WorkerTable from "../workerTable/WorkerTable";
import { IoSearch } from "react-icons/io5";
import services from "../../backend/backend";
import { useDispatch, useSelector } from "react-redux";
import { removeWorker } from "../../store/workerSlice";
import { toast, ToastContainer } from "react-toastify";

const RemoveWorker = () => {
  const dispatch = useDispatch();
  const { workerList } = useSelector((state) => state.workers);
  const [workers, setWorkers] = useState(Object.values(workerList));
  const [searchText, setSearchText] = useState("");

  const _removeWorker = async (id) => {
    // Use toast.promise to handle the asynchronous operation
    toast
      .promise(
        services.deleteWorker(id), // Promise to be monitored
        {
          pending: "Deleting worker...", // Message to show while promise is pending
          success: "Worker removed successfully!", // Message to show on promise success
          error:
            "An error occurred while removing the worker. Please try again later.", // Message to show on promise error
        }
      )
      .then((res) => {
        // If the promise resolves successfully, dispatch the removeWorker action
        if (res) {
          dispatch(removeWorker(id));
          let filterList = workers.filter((doc) => doc.id !== id);
          console.log(filterList);
          setWorkers(filterList);
        }
      })
      .catch((error) => {
        // Log and handle any errors that occur during the promise execution
        console.error("Error removing worker:", error);
      });
  };

  const searchFunction = (searchtext) => {
    setSearchText(searchtext);
    if (searchtext.length === 0) {
      console.log("0000" + workerList);
      setWorkers(Object.values(workerList));
      return;
    }

    const searchArray = Object.values(workerList).filter((worker) =>
      worker.name.toString().toLowerCase().includes(searchtext.toLowerCase())
    );
    setWorkers(searchArray);
  };

  return (
    <div id="removeWorkerContainer" className="flex">
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
        <WorkerTable
          _removeWorker={_removeWorker}
          remove={true}
          workerTable={workers}
        />
      </div>
    </div>
  );
};

export default RemoveWorker;
