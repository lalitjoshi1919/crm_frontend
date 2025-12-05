import {
  registrationPending,
  registrationSuccess,
  registrationError,
} from "./userRegestrationSlice";

import { userRegistration } from "../../api/userApi";

export const newUserRegistration = (frmDt) => async (dispatch) => {
  try {
    dispatch(registrationPending());

    const result = await userRegistration(frmDt);
    result.status === "success"
      ? dispatch(registrationSuccess(result.message))
      : dispatch(registrationError(result.message));
  } catch (error) {
    const errorMessage = error.message || error.response?.data?.message || "Registration failed";
    dispatch(registrationError(errorMessage));
  }
};