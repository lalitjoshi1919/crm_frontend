import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/v1/";
const otpReqUrl = rootUrl + "user/reset-password";
const updatePassUrl = rootUrl + "user/reset-password";

export const reqPasswordOtp = async (email) => {
	try {
		const { data } = await axios.post(otpReqUrl, { email });
		return data;
	} catch (error) {
		throw error.response?.data || { status: "error", message: error.message };
	}
};

export const updateUserPassword = async (passObj) => {
	try {
		const { data } = await axios.patch(updatePassUrl, passObj);
		return data;
	} catch (error) {
		throw error.response?.data || { status: "error", message: error.message };
	}
};