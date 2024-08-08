import {
  APPOINTMENT_FAIL,
  APPOINTMENT_REQUEST,
  APPOINTMENT_SUCCESS,
  USER_APPOINTMENTS_REQUEST,
  USER_APPOINTMENTS_SUCCESS,
  USER_APPOINTMENTS_FAIL,
  MAKE_APPOINTMENT_REQUEST,
  MAKE_APPOINTMENT_SUCCESS,
  MAKE_APPOINTMENT_FAIL,
  DELETE_APPOINTMENT_REQUEST,
  DELETE_APPOINTMENT_SUCCESS,
  DELETE_APPOINTMENT_FAIL,
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

export const appointmentsReducer = (state = { appointment: [] }, action) => {
  switch (action.type) {
    case APPOINTMENT_REQUEST:
      return {
        loading: true,
        appointment: [],
      };

    case APPOINTMENT_SUCCESS:
      return {
        loading: false,
        appointment: action.payload,
      };

    case APPOINTMENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const allAppointmentsReducer = (
  state = { allAppointments: [] },
  action
) => {
  switch (action.type) {
    case ALL_APPOINTMENT_REQUEST:
      return {
        loading: true,
        allAppointments: [],
      };

    case ALL_APPOINTMENT_SUCCESS:
      return {
        loading: false,
        allAppointments: action.payload,
      };

    case ALL_APPOINTMENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const userAppointmentsReducer = (
  state = { appointment: [] },
  action
) => {
  switch (action.type) {
    case USER_APPOINTMENTS_REQUEST:
      return {
        loading: true,
        appointment: [],
      };
    case USER_APPOINTMENTS_SUCCESS:
      return {
        loading: false,
        appointment: action.payload,
      };
    case USER_APPOINTMENTS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default: {
      return state;
    }
  }
};

export const makeAppointmentReducer = (state = { appointment: {} }, action) => {
  switch (action.type) {
    case MAKE_APPOINTMENT_REQUEST:
      return {
        loading: true,
        appointment: {},
      };

    case MAKE_APPOINTMENT_SUCCESS:
      return {
        loading: false,
        appointment: action.payload,
      };

    case MAKE_APPOINTMENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default: {
      return state;
    }
  }
};

export const deleteAppointmentReducer = (state = { message: {} }, action) => {
  switch (action.type) {
    case DELETE_APPOINTMENT_REQUEST:
      return {
        loading: true,
        message: {},
      };

    case DELETE_APPOINTMENT_SUCCESS:
      return {
        loading: false,
        message: action.payload,
      };

    case DELETE_APPOINTMENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default: {
      return state;
    }
  }
};

export const recordAppointmentReducer = (state = { record: {} }, action) => {
  switch (action.type) {
    case RECORD_APPOINTMENT_REQUEST:
      return {
        loading: true,
        record: {},
      };

    case RECORD_APPOINTMENT_SUCCESS:
      return {
        loading: false,
        record: action.payload,
      };

    case RECORD_APPOINTMENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const getRecordAppointmentReducer = (state = { record: {} }, action) => {
  switch (action.type) {
    case GET_RECORD_APPOINTMENT_REQUEST:
      return {
        loading: true,
        record: {},
      };

    case GET_RECORD_APPOINTMENT_SUCCESS:
      return {
        loading: false,
        record: action.payload,
      };

    case GET_RECORD_APPOINTMENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
