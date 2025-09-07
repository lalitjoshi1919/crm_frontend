import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/v1/";
const userProfileUrl = rootUrl + "user";
const loginUrl = rootUrl + "user/login";
const logoutUrl = rootUrl + "user/logout";
const newAccessJWT = rootUrl + "tokens";

// User Registration
export const userRegistration = async (frmData) => {
  try {
    const res = await axios.post(userProfileUrl, frmData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User Registration Verification
export const userRegistrationVerification = async (_id, email) => {
  try {
    const encodedEmail = encodeURIComponent(encodeURIComponent(email));
    const verificationUrl = `${rootUrl}user/verify/${_id}/${encodedEmail}`;
    const res = await axios.get(verificationUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 10000
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User Login
export const userLogin = async (frmData) => {
  try {
    const res = await axios.post(loginUrl, frmData);
    if (res.data.status === "success") {
      sessionStorage.setItem("accessJWT", res.data.accessJWT);
      localStorage.setItem(
        "crmSite",
        JSON.stringify({ refreshJWT: res.data.refreshJWT })
      );
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fetch User Profile
export const fetchUser = async () => {
  try {
    const accessJWT = sessionStorage.getItem("accessJWT");
    if (!accessJWT) throw new Error("Token not found!");
    const res = await axios.get(userProfileUrl, {
      headers: {
        Authorization: accessJWT,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch New Access JWT
export const fetchNewAccessJWT = async () => {
  try {
    const { refreshJWT } = JSON.parse(localStorage.getItem("crmSite") || "{}");
    if (!refreshJWT) throw new Error("Token not found!");
    const res = await axios.get(newAccessJWT, {
      headers: {
        Authorization: refreshJWT,
      },
    });
    if (res.data.status === "success") {
      sessionStorage.setItem("accessJWT", res.data.accessJWT);
    }
    return true;
  } catch (error) {
    if (error.response?.status === 403) {
      localStorage.removeItem("crmSite");
    }
    throw false;
  }
};

// User Logout
export const userLogout = async () => {
  try {
    await axios.delete(logoutUrl, {
      headers: {
        Authorization: sessionStorage.getItem("accessJWT"),
      },
    });
  } catch (error) {
    console.log(error);
  }
};
