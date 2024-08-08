import {
  GET_SINGLE_USER_REQUEST,
  GET_SINGLE_USER_SUCCESS,
  GET_SINGLE_USER_FAIL,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAIL,
} from "../constants/Users";

import axios from "axios";

export const getSingleUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_SINGLE_USER_REQUEST });

    const data = await axios.get(`https://clinic-ashen.vercel.app/auth/${id}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token-dentist-clinic")}`,
      },
    });

    dispatch({ type: GET_SINGLE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_SINGLE_USER_FAIL, payload: error });
  }
};

export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USERS_REQUEST });

    const data = await axios.get("https://clinic-ashen.vercel.app/auth/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token-dentist-clinic")}`,
      },
    });

    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: GET_ALL_USERS_FAIL, payload: error });
  }
};
