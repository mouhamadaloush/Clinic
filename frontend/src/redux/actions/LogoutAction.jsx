import { notifyError, notifySuccess } from "../../Components/Toastify/Toastify";
import {
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
} from "../constants/Logout";

import axios from "axios";

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_REQUEST });

    console.log(localStorage.getItem("token-dentist-clinic"));

    const data = await axios.post(
      "https://clinic-ashen.vercel.app/auth/logout/",
      "",
      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "token-dentist-clinic"
          )}`,
        },
      }
    );

    notifySuccess("Logout successfully");
    localStorage.removeItem("token-dentist-clinic");
    localStorage.removeItem("expiry-dentist-clinic");
    localStorage.removeItem("userId-dentist-clinic");

    setTimeout(() => {
      window.location.href = "/";
    }, [3000]);

    dispatch({ type: LOGOUT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.message });
    notifyError(error.message);
    setTimeout(() => {
      window.location.reload(false);
    }, [3000]);
  }
};
