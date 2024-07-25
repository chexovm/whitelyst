import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DataGridComponent = ({ applications, handleReviewed }) => {
  const [open, setOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewerComment, setReviewerComment] = useState("");

  const columns = [
    { field: "createdAt", headerName: "Date", flex: 1 },
    { field: "discordId", headerName: "Discord ID", flex: 1 },
    { field: "discordUsername", headerName: "Username", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "isSupporter", headerName: "Supporter?", flex: 1 },
    { field: "status", headerName: "Status" },
  ];

  const handleOpen = async (rowParams) => {
    setSelectedApplication(rowParams.row);
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    setReviewerComment("");
  };

  return (
    <>
      <DataGrid
        sx={{
          maxHeight: "90%",
          color: "white",
          "& .MuiIconButton-root": {
            color: "white",
          },
        }}
        rows={applications}
        columns={columns}
        getRowId={(row) => row._id}
        onRowClick={handleOpen}
        hideFooter={true}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>
          Application Details
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <>
              <h4>{selectedApplication.createdAt}</h4>
              <h4>Username: {selectedApplication.discordUsername}</h4>
              <h4>Discord ID: {selectedApplication.discordId}</h4>
              <h4>Application Type: {selectedApplication.type}</h4>
              <h4>
                Supporter:
                {selectedApplication.isSupporter ? "YES" : "No"}
              </h4>
              <List>
                {selectedApplication.questionsAndAnswers.map((qa, index) => (
                  <ListItem
                    sx={{
                      display: "block",
                      width: "100%",
                      wordWrap: "break-word",
                      border: "1px solid #ccc",
                      p: 2,
                      mb: 2,
                    }}
                    key={index}
                  >
                    <h4>{qa.question}</h4>
                    <p>{qa.answer}</p>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        {selectedApplication && selectedApplication?.status === "Pending" && (
          <DialogActions
            sx={{ display: "flex", border: "1px solid #ccc", p: 2 }}
          >
            <TextField
              label="Reviewer Comment"
              multiline
              rows={4}
              value={reviewerComment}
              onChange={(e) => setReviewerComment(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button
              onClick={() => {
                handleReviewed(
                  selectedApplication,
                  "Approved",
                  reviewerComment
                );
                handleClose();
              }}
              variant="contained"
              sx={{ bgcolor: "green" }}
            >
              Approve
            </Button>
            <Button
              onClick={() => {
                handleReviewed(selectedApplication, "Denied", reviewerComment);
                handleClose();
              }}
              variant="contained"
              sx={{ bgcolor: "red" }}
            >
              Deny
            </Button>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        )}
        {selectedApplication && selectedApplication.status !== "Pending" && (
          <Box
            sx={{
              border: "1px solid #ccc",
              p: 2,
            }}
          >
            <h4
              style={{ wordWrap: "break-word" }}
            >{`Reviewed by: ${selectedApplication.reviewerUsername}`}</h4>

            <h4
              style={{ wordWrap: "break-word", maxWidth: "70%" }}
            >{`Reviewer Comment: ${selectedApplication.reviewerComment}`}</h4>
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default DataGridComponent;
