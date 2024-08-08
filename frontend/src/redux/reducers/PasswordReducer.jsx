import {
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
} from "../constants/PasswordConstants";

export const changePassword = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD_REQUEST:
      return {
        loading: true,
      };

    case CHANGE_PASSWORD_SUCCESS:
      return {
        loading: false,
        message: action.payload,
      };

    case CHANGE_PASSWORD_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default: {
      return state;
    }
  }
};
