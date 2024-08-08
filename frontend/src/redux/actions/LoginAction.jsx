import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "./../constants/LoginConstants";
import axios from "axios";
import { getBasicAuthHeader } from "../../Components/Encrypt/Encryption";
import { notifyError, notifySuccess } from "../../Components/Toastify/Toastify";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const encrypt = await getBasicAuthHeader(email, password);

    console.log(encrypt);
    const { data } = await axios.post(
      "https://clinic-ashen.vercel.app/auth/login/",
      "",
      {
        headers: {
          Authorization: encrypt,
        },
      }
    );
    dispatch({ type: LOGIN_SUCCESS, payload: data });
    notifySuccess("Login successfully");

    localStorage.setItem("token-dentist-clinic", data.token);
    localStorage.setItem("expiry-dentist-clinic", data.expiry);
    localStorage.setItem("userId-dentist-clinic", data.user.id);

    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error });
    console.log(error);

    notifyError(error.response.data.detail);
    setTimeout(() => {
      window.location.reload(false);
    }, 3000);
  }
};
