import { useEffect, useState } from "react";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TablePagination,
  TextField,
} from "@mui/material";
import DataGridComponent from "./components/DataGridComponent/DataGridComponent";

const styles = {
  boxNav: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boxNavRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textField: {
    "& input": {
      color: "white",
    },
    "& label": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#1976d2",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },
  },
};

const AdminPanel = () => {
  const [admininfo, setAdminInfo] = useState({
    avatarUrl: "",
    discordUsername: "",
    accessList: { pending: [], reviewed: [] },
  });
  const [applications, setApplications] = useState([]);
  const [docsCount, setDocsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL + "/api/admininfo",
          {
            withCredentials: true,
          }
        );
        setAdminInfo({
          avatar: res.data.avatar,
          discordUsername: res.data.discordUsername,
          accessList: res.data.accessList,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchAdminInfo();
  }, []);

  const fetchApps = async (status, appType, page = 1, search = "") => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_SERVER_URL +
          `/applications/${status}/${appType}/?page=${page}&search=${search}`,
        {
          withCredentials: true,
        }
      );
      // fix the date format
      const updatedApps = res.data.applications.map((app) => {
        return { ...app, createdAt: new Date(app.createdAt).toLocaleString() };
      });
      setDocsCount(res.data.docsCount);
      setApplications(updatedApps);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleReviewed = async (application, result, comment) => {
    if (!application) {
      console.error("No application selected");
      return;
    }

    const confirmation = window.confirm(
      `Are you sure you want to ${result} this application?`
    );
    if (!confirmation) {
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/applications/update/${application._id}?type=${application.type}`,
        {
          status: result,
          reviewerUsername: admininfo.discordUsername,
          reviewerComment: comment,
        },
        {
          withCredentials: true,
        }
      );
      const updatedApps = res.data.map((app) => {
        return { ...app, createdAt: new Date(app.createdAt).toLocaleString() };
      });
      setApplications(updatedApps);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          bgcolor: "#192648",
          color: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={styles.boxNavRow}>
          <Avatar src={admininfo.avatar} alt={admininfo.discordUsername} />
          <IconButton color="primary" href="/">
            <HomeIcon sx={{ fontSize: 35, color: "white" }} />
          </IconButton>
        </Box>
        <Box sx={styles.boxNav}>
          {admininfo.accessList.pending.length > 0 && (
            <Box sx={styles.boxNav}>
              <h3 style={{ color: "white", textAlign: "center" }}>Pending</h3>
              {admininfo.accessList.pending.map((appType, index) => {
                return (
                  <Button
                    sx={{ mb: 2, width: "100%", color: "white" }}
                    variant="outlined"
                    key={index}
                    onClick={() => {
                      setPage(1);
                      fetchApps("Pending", appType);
                    }}
                  >
                    {appType}
                  </Button>
                );
              })}
            </Box>
          )}
          {admininfo.accessList.reviewed.length > 0 && (
            <Box sx={styles.boxNav}>
              <h3 style={{ color: "white", textAlign: "center" }}>Reviewed</h3>
              {admininfo.accessList.reviewed.map((appType, index) => {
                return (
                  <Button
                    sx={{ mb: 2, width: "100%", color: "white" }}
                    variant="outlined"
                    key={index}
                    onClick={() => {
                      setPage(1);
                      fetchApps("Reviewed", appType);
                    }}
                  >
                    {appType}
                  </Button>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ width: "100%", bgcolor: "#0f1924", p: 2 }}>
        {applications.length > 0 ? (
          <>
            <TextField
              value={search}
              onChange={handleSearchChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  setPage(1);
                  fetchApps(
                    applications[0].status,
                    applications[0].type,
                    1,
                    search
                  );
                }
              }}
              label="Search"
              variant="outlined"
              fullWidth
              sx={styles.textField}
            />
            <DataGridComponent
              applications={applications}
              handleReviewed={handleReviewed}
            />
            <TablePagination
              component="div"
              count={docsCount}
              page={page - 1} // page index starts from 0
              rowsPerPage={15}
              rowsPerPageOptions={[]}
              onPageChange={(event, newPage) => {
                const nextPage = newPage + 1;
                setPage(nextPage); // newPage index starts at 0
                fetchApps(
                  applications[0].status,
                  applications[0].type,
                  nextPage
                ); // fetch the next page
              }}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                color: "white",
              }}
            />
          </>
        ) : (
          <h1 style={{ color: "white", textAlign: "center" }}>
            Choose available application type to start
          </h1>
        )}
      </Box>
    </Box>
  );
};

export default AdminPanel;
