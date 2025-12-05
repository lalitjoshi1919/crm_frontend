import {
  openNewTicketPending,
  openNewTicketSuccess,
  openNewTicketFail,
} from "./addTicketSlicer";
import { createNewTicket } from "../../api/ticketApi";

export const openNewTicket = (frmData) => async (dispatch) => {
  try {
    dispatch(openNewTicketPending());

    const result = await createNewTicket(frmData);
    if (result.status === "error") {
      return dispatch(openNewTicketFail(result.message));
    }
    dispatch(openNewTicketSuccess(result.message));
  } catch (error) {
    const errorMessage = error.message || error.response?.data?.message || "Failed to create ticket";
    dispatch(openNewTicketFail(errorMessage));
  }
};