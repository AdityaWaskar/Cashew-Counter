import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase.config";
import Loading from "../loading/Loading";
import Toaster from "../tosterFunctions/toaster";
import "./signIn.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginFunction = async () => {
    setIsLoading(true);
    try {
      if (!validEmail(email)) {
        Toaster.showError("Invalid email !");
        return;
      }
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log(credential);
      localStorage.setItem("token", credential.user.accessToken);
      navigate("/main");
    } catch (error) {
      Toaster.showError("Enter right password ! ");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEnterKey = (key) => {
    if (key == "Enter") {
      loginFunction();
    }
  };

  const validEmail = (email) => {
    return /^[a-zA-Z0-9@.]+$/.test(email);
  };

  const forgotPasswordFunction = () => {
    setIsLoading(true);
    try {
      if (email.length === 0) {
        Toaster.showError("Enter email address !");
        return;
      }
      if (!validEmail(email)) {
        Toaster.showError("Invalid email !");
        return;
      }
      sendPasswordResetEmail(auth, email).then(() => {
        Toaster.showMsg("Reset password link is send to email.");
      });
    } catch (error) {
      Toaster.showError("Something went wrong !");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section id="signInContainer">
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
      <Loading isLoading={isLoading} />
      <div className="mainContainer">
        <div className="top">
          <img src={logo} alt="" />
          <h3>Sign In</h3>
          <div className="SubText1">
            Sign in and start managing your candidates
          </div>
        </div>
        <div className="bottom">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Login"
          />
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button
            className="lgBtn"
            onClick={loginFunction}
            onKeyDown={(event) => handleEnterKey(event.key)}
          >
            Login
          </button>
          <button onClick={forgotPasswordFunction} className="fgBtn">
            Forgot Password?
          </button>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
