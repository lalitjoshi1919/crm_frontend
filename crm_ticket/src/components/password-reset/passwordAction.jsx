import {
	otpReqPending,
	otpReqSuccess,
	otpReqFail,
	updatePassSuccess,
} from "./passwordSlice";

import { reqPasswordOtp, updateUserPassword } from "../../api/passwordApi";

export const sendPasswordResetOtp = email => async dispatch => {
	try {
		dispatch(otpReqPending());

		const response = await reqPasswordOtp(email);
		const { status, message } = response || {};

		if (status === "success") {
			return dispatch(otpReqSuccess({ message, email }));
		}

		dispatch(otpReqFail(message || "Failed to send password reset pin"));
	} catch (error) {
		const errorMessage = error.message || error.response?.data?.message || "Failed to send password reset pin";
		dispatch(otpReqFail(errorMessage));
	}
};

export const updatePassword = frmData => async dispatch => {
	try {
		dispatch(otpReqPending());

		const response = await updateUserPassword(frmData);
		const { status, message } = response || {};

		if (status === "success") {
			return dispatch(updatePassSuccess(message));
		}

		dispatch(otpReqFail(message || "Failed to update password"));
	} catch (error) {
		const errorMessage = error.message || error.response?.data?.message || "Failed to update password";
		dispatch(otpReqFail(errorMessage));
	}
};
