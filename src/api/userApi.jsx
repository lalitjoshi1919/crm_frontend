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
    // Single encoding is enough - backend will decode it
    const encodedEmail = encodeURIComponent(email);
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
    if (!refreshJWT) {
      throw new Error("Refresh token not found!");
    }
    
    const res = await axios.get(newAccessJWT, {
      headers: {
        Authorization: refreshJWT,
      },
    });
    
    if (res.data.status === "success" && res.data.accessJWT) {
      sessionStorage.setItem("accessJWT", res.data.accessJWT);
      return true;
    }
    
    throw new Error("Failed to refresh access token");
  } catch (error) {
    // Clear tokens on 403 (Forbidden) or any auth error
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem("crmSite");
      sessionStorage.removeItem("accessJWT");
    }
    return false;
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
    // Silently fail - clear local storage anyway
    console.error("Logout error:", error);
  } finally {
    // Always clear tokens on logout
    sessionStorage.removeItem("accessJWT");
    localStorage.removeItem("crmSite");
  }
};
