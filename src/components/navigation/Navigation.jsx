import React from "react";
import { GrUserWorker } from "react-icons/gr";
import { VscDashboard } from "react-icons/vsc";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { TiGroupOutline } from "react-icons/ti";
import { GiFruitBowl } from "react-icons/gi";

import "./navigation.css";
import "../../index.css";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase.config";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const data = [
  {
    id: 1,
    name: "Add Worker",
    logo: <GrUserWorker />,
  },
  {
    id: 2,
    name: "Remove Worker",
    logo: <IoPersonRemoveOutline />,
  },
  {
    id: 3,
    name: "Total No. of Worker",
    logo: <TiGroupOutline />,
  },
  {
    id: 4,
    name: "Dashboard",
    logo: <VscDashboard />,
  },
  {
    id: 5,
    name: "Add Cashew",
    logo: <GiFruitBowl />,
  },
];

const Navigation = (props) => {
  const navigate = useNavigate();
  const onClickedEvent = (elementName) => {
    props.setnavSelection(elementName);
  };
  const handleLogout = async () => {
    props.setIsLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
    props.setIsLoading(false);
  };

  return (
    <nav>
      <div className="top flex">
        <img src={logo} alt="" />
      </div>
      <div className="middle">
        <ul>
          {data.map((d) => (
            <li
              className={props.actionName === d.name ? "active" : "null"}
              key={d.id + d.name}
              onClick={() => onClickedEvent(d.name)}
            >
              <div className="icon">{d.logo}</div>
              <div className="name">{d.name}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="bottom">
        <div className="icon">
          <IoMdLogOut />
        </div>
        <div className="name" onClick={() => handleLogout()}>
          Logout
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
