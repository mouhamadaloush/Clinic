import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "../constants/RegisterConstants";

export const registerReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return {
        loading: true,
      };
    case REGISTER_SUCCESS:
      return {
        loading: false,
      };
    case REGISTER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default: {
      return state;
    }
  }
};
