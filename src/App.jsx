import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Protected, SignIn } from "./components/index.js";
import Main from "./pages/main/Main";
import services from "./backend/backend";
import { useDispatch } from "react-redux";
import { getWorkerList } from "./store/workerSlice.js";

const App = () => {
  const dispatch = useDispatch();
  const getAllWorkerList = async () => {
    const workerList = await services.getAllWorker();
    workerList.map((workers) => {
      dispatch(getWorkerList(workers));
    });
  };

  useEffect(() => {
    getAllWorkerList();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/main" element={<Protected />}>
          <Route path="/main" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
