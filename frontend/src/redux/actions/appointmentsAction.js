import { notifyError, notifySuccess } from "../../Components/Toastify/Toastify";
import {
  APPOINTMENT_FAIL,
  APPOINTMENT_REQUEST,
  APPOINTMENT_SUCCESS,
  USER_APPOINTMENTS_REQUEST,
  USER_APPOINTMENTS_SUCCESS,
  USER_APPOINTMENTS_FAIL,
  DELETE_APPOINTMENT_REQUEST,
  DELETE_APPOINTMENT_SUCCESS,
  DELETE_APPOINTMENT_FAIL,
  MAKE_APPOINTMENT_REQUEST,
  MAKE_APPOINTMENT_SUCCESS,
  MAKE_APPOINTMENT_FAIL,
  RECORD_APPOINTMENT_REQUEST,
  RECORD_APPOINTMENT_SUCCESS,
  RECORD_APPOINTMENT_FAIL,
  GET_RECORD_APPOINTMENT_FAIL,
  GET_RECORD_APPOINTMENT_SUCCESS,
  GET_RECORD_APPOINTMENT_REQUEST,
  ALL_APPOINTMENT_REQUEST,
  ALL_APPOINTMENT_SUCCESS,
  ALL_APPOINTMENT_FAIL,
} from "../constants/Appointments";

import axios from "axios";

export const getUnavailableDates = () => async (dispatch) => {
  try {
    dispatch({ type: APPOINTMENT_REQUEST });

    const data = await axios.get(
      `https://clinic-ashen.vercel.app/appointment/get_unavailable_dates/`,

      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "token-dentist-clinic"
          )}`,
        },
      }
    );

    dispatch({ type: APPOINTMENT_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: APPOINTMENT_FAIL, payload: error });
  }
};

export const getAllAppointments = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_APPOINTMENT_REQUEST });

    const data = await axios.get(
      "https://clinic-ashen.vercel.app/appointment/list_appointments/",
      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "token-dentist-clinic"
          )}`,
        },
      }
    );

    dispatch({ type: ALL_APPOINTMENT_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: ALL_APPOINTMENT_FAIL, payload: error });
  }
};

export const getUserAppointments = () => async (dispatch) => {
  try {
    dispatch({ type: USER_APPOINTMENTS_REQUEST });

    const data = await axios.get(
      "https://clinic-ashen.vercel.app/appointment/get_user_appointments/",
      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "token-dentist-clinic"
          )}`,
        },
      }
    );

    dispatch({ type: USER_APPOINTMENTS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: USER_APPOINTMENTS_FAIL, payload: error });
  }
};

export const MakeNewAppointments = (date, reason) => async (dispatch) => {
  try {
    dispatch({ type: MAKE_APPOINTMENT_REQUEST });

    const data = await axios.post(
      "https://clinic-ashen.vercel.app/appointment/make_appointment/",
      {
        chosen_date: date,
        reason_of_appointment: reason,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "token-dentist-clinic"
          )}`,
        },
      }
    );

    dispatch({ type: MAKE_APPOINTMENT_SUCCESS, payload: data.data });

    notifySuccess("Make Appointment is successfully");

    setTimeout(() => {
      window.location.href = "/myappointments";
    }, 3000);
  } catch (error) {
    dispatch({ type: MAKE_APPOINTMENT_FAIL, payload: error });
    console.log(error);
    if (error.response.status === 500) {
      notifyError("The Appointment is Already booked");
    }
  }
};

export const deleteAppointment = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_APPOINTMENT_REQUEST });

    const data = await axios.delete(
      `https://clinic-ashen.vercel.app/appointment/delete/?id=${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "token-dentist-clinic"
          )}`,
        },
      }
    );

    console.log(data);

    dispatch({ type: DELETE_APPOINTMENT_SUCCESS, payload: data });

    notifySuccess("The Appointment Has been deleted");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } catch (error) {
    console.log(error);
    notifyError("The Appointment Does Not Exist");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    dispatch({ type: DELETE_APPOINTMENT_FAIL, payload: error });
  }
};

export const RecordAppointmentAction = (formData) => async (dispatch) => {
  try {
    dispatch({ type: RECORD_APPOINTMENT_REQUEST });

    const data = await axios.post(
      "https://clinic-ashen.vercel.app/appointment/record/",

      formData,

      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "token-dentist-clinic"
          )}`,
        },
      }
    );

    notifySuccess(data.data.message);

    // notifySuccess(data);

    dispatch({ type: RECORD_APPOINTMENT_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: RECORD_APPOINTMENT_FAIL, error: error });
    console.log(error);
  }
};

export const getRecordAction = (appointment_id) => async (dispatch) => {
  try {
    dispatch({ type: GET_RECORD_APPOINTMENT_REQUEST });

    const data = await axios.get(
      ` https://clinic-ashen.vercel.app/appointment/get_record/?appointment_id=${appointment_id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "token-dentist-clinic"
          )}`,
        },
      }
    );

    dispatch({ type: GET_RECORD_APPOINTMENT_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: GET_RECORD_APPOINTMENT_FAIL, error: error });
  }
};
