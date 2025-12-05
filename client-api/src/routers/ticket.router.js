const express = require("express");
const router = express.Router();
const {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  updateStatusClose,
  deleteTicket,
} = require("../model/ticket/Ticket.model");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");

const {
  createNewTicketValidation,
  replyTicketMessageValidation,
} = require("../middlewares/formValidation.middleware");

router.all("/", (req, res, next) => {
  // res.json({ message: "return form ticket router" });

  next();
});

// create new ticket
router.post(
  "/",
  createNewTicketValidation,
  userAuthorization,
  async (req, res) => {
    try {
      const { subject, sender, message } = req.body;

      const userId = req.userId;

      const ticketObj = {
        clientId: userId,
        subject,
        conversations: [
          {
            sender,
            message,
          },
        ],
      };

      const result = await insertTicket(ticketObj);

      if (result._id) {
        return res.json({
          status: "success",
          message: "New ticket has been created!",
        });
      }

      return res.status(500).json({
        status: "error",
        message: "Unable to create the ticket, please try again later",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ 
        status: "error", 
        message: error.message || "Internal server error" 
      });
    }
  }
);

// Get all tickets for a specific user
router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await getTickets(userId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Get  tickets for a specific user
router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;

    const clientId = req.userId;
    const result = await getTicketById(_id, clientId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({ 
      status: "error", 
      message: error.message || "Internal server error" 
    });
  }
});

// update reply message form client
router.put(
  "/:_id",
  replyTicketMessageValidation,
  userAuthorization,
  async (req, res) => {
    try {
      const { message, sender } = req.body;
      const { _id } = req.params;
      const clientId = req.userId;

      const result = await updateClientReply({ _id, message, sender });

      if (result._id) {
        return res.json({
          status: "success",
          message: "your message updated",
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Unable to update your message, please try again later",
      });
    } catch (error) {
      console.error("Error updating ticket reply:", error);
      return res.status(500).json({ 
        status: "error", 
        message: error.message || "Internal server error" 
      });
    }
  }
);

// update ticket status to close
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await updateStatusClose({ _id, clientId });

    if (result._id) {
      return res.json({
        status: "success",
        message: "The ticket has been closed",
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Unable to update the ticket",
    });
  } catch (error) {
    console.error("Error closing ticket:", error);
    return res.status(500).json({ 
      status: "error", 
      message: error.message || "Internal server error" 
    });
  }
});

// Delete a ticket
router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await deleteTicket({ _id, clientId });

    return res.json({
      status: "success",
      message: "The ticket has been deleted",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return res.status(500).json({ 
      status: "error", 
      message: error.message || "Internal server error" 
    });
  }
});

module.exports = router;