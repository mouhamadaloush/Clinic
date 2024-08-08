import {
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
} from "../constants/Logout";

export const logoutReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case LOGOUT_REQUEST:
      return {
        loading: true,
      };

    case LOGOUT_SUCCESS:
      return {
        loading: false,
      };

    case LOGOUT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
