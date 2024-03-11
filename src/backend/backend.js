import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase.config";
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

const services = {
  // return totoal worker count
  async workerCount() {
    const ref = collection(firestore, "workers");
    let workerList = await getDocs(ref);
    return workerList.docs.length;
  },
  async add(data) {
    const ref = doc(firestore, `workers/${data["id"]}`);

    try {
      // console.log(data);
      await setDoc(ref, data);
      return "Worker Added";
    } catch (error) {
      import.meta.env.VITE_MODE && console.log(error);
      return "Error while adding worker!";
    }
  },

  async addCashew(id, data) {
    // add cashewCount to the total variable
    const ref1 = doc(firestore, `workers/${id}`);
    const oldTotalDetails = await getDoc(ref1);
    let oldTotal = oldTotalDetails?.data()["total"];

    let [date, month, year] = data["date"].split("-");
    print(months[parseInt(month) - 1]);
    print(
      `workers/${id}`,
      "cashewcounter",
      `${year}`,
      `${months[parseInt(month) - 1]}`
    );
    const ref = doc(
      firestore,
      "workers",
      `${id}`,
      "cashewcounter",
      `${year}`,
      `${months[parseInt(month) - 1]}`,
      `${data["date"]}`
    ); // Firebase creates this automatically
    try {
      const cashewexists = await getDoc(ref);
      if (cashewexists.data() !== undefined) {
        oldTotal = (+oldTotal - +cashewexists.data()["value"]).toFixed(1);
      }

      await setDoc(ref, data);
      await updateDoc(ref1, { total: (+oldTotal + +data["value"]).toFixed(1) });
      print("Cashew Added");
      return "Cashew Added";
    } catch (e) {
      console.error(e);
      return "Error while adding worker!";
    }
  },

  async getAllWorker() {
    const ref = collection(firestore, "workers");
    let workerList = await getDocs(ref);
    // get all the workers form database
    workerList = workerList.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    // Filter worker who is currently working
    workerList = workerList.filter((doc) => !doc.DOL);
    return workerList;
  },

  async getCashewById(id) {
    const ref = doc(firestore, `workers/${id}`);
    console.log(`workers/${id}`);
    let cashewList = await getDoc(ref);
    return cashewList.data().total;
  },

  async getCashewData(month, year) {
    let ref = collection(firestore, "workers");
    let ids = await getDocs(ref);
    let workerIds = ids.docs.map((doc) => {
      if (!doc.data().DOL) {
        return doc.id;
      }
    });
    let workerCashewData = {};
    await Promise.all(
      workerIds.map(async (id) => {
        if (id === undefined) return;
        let yearlyData = {};
        let cashewRef = collection(
          firestore,
          `workers/${id}/cashewcounter/${year}/${months[month]}`
        );
        let monthlyData = {};
        let casData = {};
        let cashewData = await getDocs(cashewRef);
        cashewData.docs?.map((doc) => {
          casData[doc.data().date] = (+doc.data().value).toFixed(1);
        });

        monthlyData[months[month]] = casData;
        workerCashewData[id] = monthlyData;
      })
    );
    print(workerCashewData);
    return workerCashewData;
  },
  async getCashewByYear(lowerRange, higherRange, workerId) {
    lowerRange = new Date(lowerRange);
    higherRange = new Date(higherRange);

    // * iterate between starting date and ending date
    let yearlyData = {};
    for (
      let year = lowerRange.getFullYear();
      year <= higherRange.getFullYear();
      year++
    ) {
      let monthlyData = {};
      for (
        let month = lowerRange.getMonth();
        month <= higherRange.getMonth();
        month++
      ) {
        // * Retrieve the data base on the range
        let cashewRef = collection(
          firestore,
          `workers/${workerId}/cashewcounter/${year}/${months[month]}`
        );

        let cashewData = await getDocs(cashewRef);
        let dates = {};
        cashewData.docs.map((doc) => {
          if (!doc.data().DOL) {
            dates[doc.data().date] = doc.data().value;
          }
        });
        monthlyData[months[month]] = dates;
      }
      yearlyData[year] = monthlyData;
    }
    return yearlyData;
  },

  // Pratically not removing form the database instead of that only add date of leave(DOL)
  async deleteWorker(id) {
    // Get the current date
    try {
      let currentDate = new Date();

      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
      const year = currentDate.getFullYear();

      currentDate = `${day}-${month}-${year}`;
      const ref1 = doc(firestore, `workers/${id}`);
      await updateDoc(ref1, { DOL: currentDate });
      print("User Deleteed successfully");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

function print(value) {
  import.meta.env.VITE_MODE == "development" && console.log(value);
}
export default services;
