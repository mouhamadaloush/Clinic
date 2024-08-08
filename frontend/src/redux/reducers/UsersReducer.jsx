import {
  GET_SINGLE_USER_REQUEST,
  GET_SINGLE_USER_SUCCESS,
  GET_SINGLE_USER_FAIL,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAIL,
} from "../constants/Users";

export const singleUserReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case GET_SINGLE_USER_REQUEST:
      return {
        loading: true,
        user: {},
      };
    case GET_SINGLE_USER_SUCCESS:
      return {
        loading: false,
        user: action.payload,
      };
    case GET_SINGLE_USER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const getALlUsersReducer = (state = { users: null }, action) => {
  switch (action.type) {
    case GET_ALL_USERS_REQUEST: {
      return {
        users: null,
        loading: true,
      };
    }

    case GET_ALL_USERS_SUCCESS:
      return {
        users: action.payload,
        loading: false,
      };

    case GET_ALL_USERS_FAIL:
      return {
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};
