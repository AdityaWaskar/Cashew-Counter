import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = {
  showMsg(msg, position = "bottom-right", time = 2000) {
    toast.success(msg, {
      position: position,
      autoClose: time,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  },
  showError(msg, position, time) {
    toast.error(msg, {
      position: position,
      autoClose: time,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  },
};

export default Toaster;
