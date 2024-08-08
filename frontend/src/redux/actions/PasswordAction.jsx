import {
  notifyError,
  notifySuccess,
} from "../../Components/Toastify/Toastify.js";
import {
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
} from "../constants/PasswordConstants.js";

import axios from "axios";

export const changePassword =
  (current_password, new_password) => async (dispatch) => {
    try {
      dispatch({ type: CHANGE_PASSWORD_REQUEST });

      const data = await axios.post(
        "https://clinic-ashen.vercel.app/auth/password_change/",
        {
          current_password,
          new_password,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem(
              "token-dentist-clinic"
            )}`,
          },
        }
      );

      notifySuccess(data.data.message);
      dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: CHANGE_PASSWORD_FAIL, payload: error });
      if (error.response.status === 401) {
        notifyError(error.response.data.detail);
      } else if (error.response.status === 400) {
        notifyError(error.response.data.current_password[0]);
      }
    }
  };
