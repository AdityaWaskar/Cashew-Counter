import React, { useState } from "react";
import {
  AddCashew,
  AddWorker,
  AllWorker,
  Dashboard,
  Loading,
  Navigation,
  RemoveWorker,
} from "../../components";
import "./main.css";

const Main = () => {
  const [navSelection, setnavSelection] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <section className="_mainContainer">
      <Loading isLoading={isLoading} />
      <Navigation
        setIsLoading={setIsLoading}
        actionName={navSelection}
        setnavSelection={setnavSelection}
      />
      {navSelection === "Add Worker" && <AddWorker />}
      {navSelection === "Remove Worker" && <RemoveWorker />}
      {navSelection === "Total No. of Worker" && <AllWorker />}
      {navSelection === "Dashboard" && <Dashboard />}
      {navSelection === "Add Cashew" && <AddCashew />}
    </section>
  );
};

export default Main;
