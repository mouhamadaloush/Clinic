import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { loginReducer } from "./reducers/LoginReducer";
import { registerReducer } from "./reducers/RegisterReducer";
import {
  allAppointmentsReducer,
  appointmentsReducer,
  deleteAppointmentReducer,
  getRecordAppointmentReducer,
  makeAppointmentReducer,
  recordAppointmentReducer,
  userAppointmentsReducer,
} from "./reducers/appointmentsReducer";
import { getALlUsersReducer, singleUserReducer } from "./reducers/UsersReducer";

const reducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  appoint: appointmentsReducer,
  userAppointments: userAppointmentsReducer,
  makeAppointment: makeAppointmentReducer,
  deleteAppointment: deleteAppointmentReducer,
  recordAppointment: recordAppointmentReducer,
  getRecordAppointment: getRecordAppointmentReducer,
  singleUser: singleUserReducer,
  allUsers: getALlUsersReducer,
  allAppointments: allAppointmentsReducer,
});

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
