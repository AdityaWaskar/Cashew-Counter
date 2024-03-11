import { createSlice } from "@reduxjs/toolkit";

export const workerSlice = createSlice({
  name: "workers",
  initialState: {
    workerList: {},
    workerListByCashew: {},
    dateRange: "",
  },
  reducers: {
    getWorkerList: (state, action) => {
      state.workerList[action.payload.id] = action.payload;
    },

    addWorker: (state, action) => {
      state.workerList[action.payload.id] = action.payload;
    },

    removeWorker: (state, action) => {
      delete state.workerList[action.payload];
    },

    addCashew: (state, action) => {
      // console.log(action.payload);
      const { id, year, month, data } = action.payload;
      let yearJson = { [year]: data };

      if (
        state.workerListByCashew[id] &&
        state.workerListByCashew[id][year] &&
        state.workerListByCashew[id][year][month]
      ) {
        // console.log("date is updated");
        state.workerListByCashew[id][year][month] = {
          ...state.workerListByCashew[id][year][month],
          ...data[month],
        };
      } else if (
        state.workerListByCashew[id] &&
        state.workerListByCashew[id][year]
      ) {
        // console.log("year is updated");
        state.workerListByCashew[id][year] = {
          ...state.workerListByCashew[id][year],
          ...data,
        };
      } else {
        // console.log("id is updated");
        state.workerListByCashew[id] = {
          ...state.workerListByCashew[id],
          ...yearJson,
        };
      }
    },

    addIndividualCashew: (state, action) => {
      let id = action.payload.id;
      let year = action.payload.year;
      let month = action.payload.month;
      let data = action.payload.data;
      let date = action.payload.date;
      let fullDate = action.payload.fullDate;
      let dateJson = {};
      let yearJson = {};
      let monthJson = {};
      dateJson[fullDate] = data;
      monthJson[month] = dateJson;
      yearJson[year] = monthJson;
      if (
        state.workerListByCashew[id] &&
        state.workerListByCashew[id][year] &&
        state.workerListByCashew[id][year][month][fullDate]
      ) {
        // console.log("date is updated");
        state.workerListByCashew[id][year][month][fullDate] = data;
      } else if (
        state.workerListByCashew[id] &&
        state.workerListByCashew[id][year] &&
        state.workerListByCashew[id][year][month]
      ) {
        // console.log("Month is updated");
        state.workerListByCashew[id][year][month] = {
          ...state.workerListByCashew[id][year][month],
          ...dateJson,
        };
      } else if (
        state.workerListByCashew[id] &&
        state.workerListByCashew[id][year]
      ) {
        // console.log("year is updated");
        state.workerListByCashew[id][year] = {
          ...state.workerListByCashew[id][year],
          ...monthJson,
        };
      } else if (state.workerListByCashew[id]) {
        // console.log("id is updated");
        state.workerListByCashew[id] = {
          ...state.workerListByCashew[id],
          ...yearJson,
        };
      }
    },

    updateTotalCashewValue: (state, action) => {
      state.workerList[action.payload.id]["total"] = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getWorkerList,
  addWorker,
  removeWorker,
  addCashew,
  addIndividualCashew,
  updateTotalCashewValue,
} = workerSlice.actions;

export default workerSlice.reducer;
