import {
  fetchTicketLoading,
  fetchTicketSuccess,
  fetchTicketFail,
  searchTickets,
  fetchSingleTicketLoading,
  fetchSingleTicketSuccess,
  fetchSingleTicketFail,
  replyTicketLoading,
  replyTicketSuccess,
  replyTicketFail,
  closeTicketLoading,
  closeTicketSuccess,
  closeTicketFail,
} from "./ticketsSlice";

import {
  getAllTickets,
  getSingleTicket,
  updateReplyTicket,
  updateTicketStatusClosed,
} from "../../api/ticketApi";

export const fetchAllTickets = () => async (dispatch) => {
  dispatch(fetchTicketLoading());
  try {
    const result = await getAllTickets();
    if (result.data && result.data.result && result.data.result.length > 0) {
      dispatch(fetchTicketSuccess(result.data.result));
    } else {
      dispatch(fetchTicketSuccess([])); // Return empty array if no tickets
    }
  } catch (error) {
    const errorMessage = error.message || error.response?.data?.message || "Failed to fetch tickets";
    dispatch(fetchTicketFail(errorMessage));
  }
};

export const filterSerachTicket = (str) => (dispatch) => {
  dispatch(searchTickets(str));
};

//Actions for single ticket only
export const fetchSingleTicket = (_id) => async (dispatch) => {
  dispatch(fetchSingleTicketLoading());
  try {
    const result = await getSingleTicket(_id);
    if (result.data && result.data.result && result.data.result.length > 0) {
      dispatch(fetchSingleTicketSuccess(result.data.result[0]));
    } else {
      dispatch(fetchSingleTicketFail("Ticket not found"));
    }
  } catch (error) {
    const errorMessage = error.message || error.response?.data?.message || "Failed to fetch ticket";
    dispatch(fetchSingleTicketFail(errorMessage));
  }
};

//Actions for replying on single ticket
export const replyOnTicket = (_id, msgObj) => async (dispatch) => {
  dispatch(replyTicketLoading());
  try {
    const result = await updateReplyTicket(_id, msgObj);
    if (result.status === "error") {
      return dispatch(replyTicketFail(result.message));
    }

    dispatch(fetchSingleTicket(_id));
    dispatch(replyTicketSuccess(result.message));
  } catch (error) {
    const errorMessage = error.message || error.response?.data?.message || "Failed to update ticket";
    dispatch(replyTicketFail(errorMessage));
  }
};

//Actions for closing ticket
export const closeTicket = (_id) => async (dispatch) => {
  dispatch(closeTicketLoading());
  try {
    const result = await updateTicketStatusClosed(_id);
    if (result.status === "error") {
      return dispatch(closeTicketFail(result.message));
    }

    dispatch(fetchSingleTicket(_id));
    dispatch(closeTicketSuccess("Status Updated successfully"));
  } catch (error) {
    const errorMessage = error.message || error.response?.data?.message || "Failed to close ticket";
    dispatch(closeTicketFail(errorMessage));
  }
};