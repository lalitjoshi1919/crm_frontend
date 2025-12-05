import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/v1/";
const ticketUrl = rootUrl + "ticket/";
const closeTicketUrl = rootUrl + "ticket/close-ticket/";

export const getAllTickets = async () => {
  try {
    const result = await axios.get(rootUrl + "ticket", {
      headers: {
        Authorization: sessionStorage.getItem("accessJWT"),
      },
    });
    return result;
  } catch (error) {
    throw error.response?.data || { status: "error", message: error.message };
  }
};

export const getSingleTicket = async (_id) => {
  try {
    const result = await axios.get(ticketUrl + _id, {
      headers: {
        Authorization: sessionStorage.getItem("accessJWT"),
      },
    });
    return result;
  } catch (error) {
    throw error.response?.data || { status: "error", message: error.message };
  }
};

export const updateReplyTicket = async (_id, msgObj) => {
  try {
    const result = await axios.put(ticketUrl + _id, msgObj, {
      headers: {
        Authorization: sessionStorage.getItem("accessJWT"),
      },
    });
    return result.data;
  } catch (error) {
    throw error.response?.data || { status: "error", message: error.message };
  }
};

export const updateTicketStatusClosed = async (_id) => {
  try {
    const result = await axios.patch(
      closeTicketUrl + _id,
      {},
      {
        headers: {
          Authorization: sessionStorage.getItem("accessJWT"),
        },
      }
    );
    return result.data;
  } catch (error) {
    throw error.response?.data || { status: "error", message: error.message };
  }
};

export const createNewTicket = async (frmData) => {
  try {
    const result = await axios.post(ticketUrl, frmData, {
      headers: {
        Authorization: sessionStorage.getItem("accessJWT"),
      },
    });
    return result.data;
  } catch (error) {
    throw error.response?.data || { status: "error", message: error.message };
  }
};