import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "./../constants/LoginConstants";

export const loginReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        loading: true,
      };

    case LOGIN_SUCCESS:
      return {
        loading: false,
      };

    case LOGIN_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default: {
      return state;
    }
  }
};
