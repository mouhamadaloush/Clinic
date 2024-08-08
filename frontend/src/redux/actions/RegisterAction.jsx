import { notifyError, notifySuccess } from "../../Components/Toastify/Toastify";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "../constants/RegisterConstants";
import axios from "axios";

export const registerUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    console.log(user);

    const { data } = await axios.post(
      "https://clinic-ashen.vercel.app/auth/register/",
      user
    );

    console.log(data);

    notifySuccess("Register successfully Please Login");

    dispatch({ type: REGISTER_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    if (error.response.data.email[0]) {
      notifyError(error.response.data.email[0]);
    }

    dispatch({ type: REGISTER_FAIL, message: error });
  }
};
