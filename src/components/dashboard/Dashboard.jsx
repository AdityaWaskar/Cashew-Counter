import React, { useEffect, useState } from "react";
import Graph from "../graph/Graph";
import "./dashboard.css";
import "../../index.css";
import services from "../../backend/backend";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { addCashew } from "../../store/workerSlice";
import { print } from "../../utils/common";
import profile from "../../assets/profile.png";

const Profile = ({ workerInfo, range }) => {
  return (
    <div className="workerProfile">
      <div className="row name flex">
        <label>Name</label>
        <span>:</span>
        <div>{workerInfo.name}</div>
      </div>
      <div className="row gender flex">
        <label>Gender</label>
        <span>:</span>
        <div>{workerInfo.gender}</div>
      </div>
      <div className="row phoneNo flex">
        <label>Phone No.</label>
        <span>:</span>
        <div>{workerInfo.phoneNo}</div>
      </div>
      <div className="row totalCahew flex">
        <label>Total Cashew</label>
        <span>:</span>
        <div>{workerInfo.total} KG</div>
      </div>
      <div className="row totalCahewBtwRange flex">
        <label>Cashew ({range})</label>
        <span>:</span>
        <div>{workerInfo[range]} KG</div>
      </div>
    </div>
  );
};

const WorkerTable = ({
  workerList,
  workerTable,
  isSkeleton,
  setWorkerInfo,
  dateRange,
}) => {
  const setIndividualWorkerInfo = (workerinfo, rangeValue) => {
    let d = { ...workerinfo };
    d[dateRange] = rangeValue;
    setWorkerInfo(d);
  };
  print(workerTable);
  return (
    <div className="wTable">
      <div className="tr th">
        <div className="td"></div>
        <div className="td">Name</div>
        <div className="td">Cashew(Kg)</div>
      </div>
      <div className="scroll">
        {isSkeleton &&
          Array(7)
            .fill()
            .map((_, index) => (
              <div className="tr skeleton" key={index + Math.random() * 1000}>
                <div className="td">
                  <Skeleton
                    className="img"
                    baseColor="#d9d9d97a"
                    circle={100}
                  />
                </div>
                <div className="td">
                  <Skeleton className="name" baseColor="#d9d9d97a" />
                </div>
                <div className="td">
                  <Skeleton className="value" baseColor="#d9d9d97a" />
                </div>
              </div>
            ))}

        {Object.keys(workerTable).length > 0 &&
          Object.keys(workerTable).map((key) => (
            <div
              className="tr"
              key={key}
              onClick={() =>
                setIndividualWorkerInfo(workerList[key], workerTable[key])
              }
            >
              <div className="td">
                <img src={profile} alt="Profile" />
              </div>
              <div className="td">{workerList[key]["name"]}</div>
              <div className="td">{workerTable[key]}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

const formatDate = (date) => {
  // Format the date as dd-mm-yyyy
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};
function subtractDaysFromDate(days) {
  var result = new Date();
  result.setDate(result.getDate() - days);
  return formatDate(result);
}
const Dashboard = () => {
  const { workerList, workerListByCashew } = useSelector(
    (state) => state.workers
  );
  const dispatch = useDispatch();
  const [lowerRange, setLowerRange] = useState(subtractDaysFromDate(7));
  const [higherRange, setHigherRange] = useState(formatDate(new Date()));
  const [workerData, setWorkerData] = useState({}); // All worker cashew data between date range
  const [workerInfo, setWorkerInfo] = useState({}); // stores worker particular data
  const [isSkeleton, setisSkeleton] = useState(false);

  const onChangeEvent = (changeState, value) => changeState(value);

  const getCashew = async () => {
    setisSkeleton(true);
    setWorkerInfo({});
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
    let startDate = new Date(lowerRange);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(higherRange);
    endDate.setHours(0, 0, 0, 0);

    // Loop for iterate over the years
    for (
      let year = startDate.getFullYear();
      year <= endDate.getFullYear();
      year++
    ) {
      // Loop for iterate over the months
      for (
        let month = startDate.getMonth();
        month <= endDate.getMonth();
        month++
      ) {
        // if the month data is already in store than skip the fectch call for that month
        if (
          workerListByCashew["1"] &&
          workerListByCashew["1"][year.toString()] &&
          workerListByCashew["1"][year.toString()][months[month]]
        ) {
          print(months[month] + " is already exits");
          continue;
        }
        let data = await services.getCashewData(month, year); // Fetch the data of all the students in particular month and year
        Object.keys(data).forEach((key) => {
          dispatch(
            addCashew({
              data: data[key],
              id: key,
              month: months[month],
              year: year,
            })
          ); // stored the data on stores
        });
      }
    }

    let data = {};
    // Loop for iterate over the no of workers
    for (const id in workerList) {
      let totalCashew = 0;
      // Loop for iterate over the years
      for (
        let year = startDate.getFullYear();
        year <= endDate.getFullYear();
        year++
      ) {
        // Loop for iterate over the months
        for (
          let month = startDate.getMonth();
          month <= endDate.getMonth();
          month++
        ) {
          print(month + " | " + year);
          // If the data is present then calulate the total cashew between the range from start to end date
          if (
            workerListByCashew[id] &&
            workerListByCashew[id][year] &&
            workerListByCashew[id][year][months[month]]
          ) {
            print("-----------" + year + " | " + months[month]);
            for (const key in workerListByCashew[id][year][months[month]]) {
              let [d, m, y] = key.split("-");
              let date = new Date(`${y}-${m}-${d}`);
              print(
                startDate +
                  " | " +
                  date +
                  " | " +
                  endDate +
                  " | " +
                  (date >= startDate && date <= endDate)
              );
              if (date >= startDate && date <= endDate) {
                totalCashew = (
                  +totalCashew +
                  +workerListByCashew[id][year][months[month]][key]
                ).toFixed(1);
              }
            }
          }
        }
      }
      data[id] = totalCashew;
    }
    // month++;

    setWorkerData(data);
    setisSkeleton(false);
  };
  const dateFormate1 = (stringDate) => {
    let [date1, date2] = stringDate.split(" | ");
    let [y1, m1, d1] = date1.split("-");
    let [y2, m2, d2] = date2.split("-");

    return `${d1}-${m1}-${y1} | ${d2}-${m2}-${y2}`;
  };

  useEffect(() => {
    getCashew();
  }, [workerListByCashew]);
  return (
    <div id="dashboardContainer">
      <div className="left flex">
        <div className="dashboard">
          <Graph workerData={workerData} />
        </div>
        {Object.keys(workerInfo).length !== 0 && (
          <div className="personalData flex">
            <Profile
              workerInfo={workerInfo}
              range={dateFormate1(`${lowerRange} | ${higherRange}`)}
            />
          </div>
        )}
      </div>
      <div className="right">
        <div className="row flex">
          <input
            type="date"
            name=""
            onChange={(e) => onChangeEvent(setLowerRange, e.target.value)}
            id=""
            value={lowerRange}
          />
          <input
            type="date"
            name=""
            onChange={(e) => onChangeEvent(setHigherRange, e.target.value)}
            id=""
            value={higherRange}
          />
          <button onClick={getCashew}>Filter</button>
        </div>
        <div className="workerList flex">
          <WorkerTable
            workerList={workerList}
            workerTable={workerData}
            isSkeleton={isSkeleton}
            setWorkerInfo={setWorkerInfo}
            dateRange={dateFormate1(`${lowerRange} | ${higherRange}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
