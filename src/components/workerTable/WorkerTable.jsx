import React from "react";
import "./workerTable.css";
import { MdDelete } from "react-icons/md";
import profile from "../../assets/profile.png";

const WorkerTable = ({ _removeWorker, remove, workerTable }) => {
  return (
    <div className="workerTable">
      <div className="tr">
        <div className="th td"></div>
        <div className="th td">Name</div>
        <div className="th td">Sex</div>
        <div className="th td">Phone No.</div>
        <div className="th td">Cashew(Kg)</div>
        {remove && <div className="th td">Remove</div>}
      </div>
      <div className="tbody">
        {Object.values(workerTable).length !== 0 ? (
          Object.values(workerTable).map((w, index) => (
            <div className="tr" key={w.phoneNo + index}>
              <div className="td">
                <img src={profile} alt="" />
              </div>
              <div className="td">{w.name}</div>
              <div className="td">{w.gender}</div>
              <div className="td">{w.phoneNo}</div>
              <div className="td">{w.total || 0}</div>
              {remove && (
                <div
                  className="td removeBtn"
                  onClick={() => _removeWorker(w.id)}
                >
                  <MdDelete size={20} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No data found!</div>
        )}
      </div>
    </div>
  );
};

export default WorkerTable;
