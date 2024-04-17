import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { theme } from "../../utils/theme";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdvanceNetworkPage: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [usersPerRow, setUsersPerRow] = useState(5);
  const [paginatedUsers, setPaginatedUsers] = useState<any[][]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sendconnection, setSendConnection] = useState<any>(null);
  const [userConnections, setUserConnections] = useState<any>(null);
  const [filterByMyConnections, setFilterByMyConnections] =
    useState<boolean>(false);
  const [filterByRequestSent, setFilterByRequestSent] =
    useState<boolean>(false);
  const [filterByRequestReceived, setFilterByRequestReceived] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("showall");
  const navigate = useNavigate();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // function to handle search bar.
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // function to fetch users
  const fetchData = async (
    pageNumber: number,
    filterByMyConnections: boolean,
    filterByRequestSent: boolean,
    filterByRequestReceived: boolean
  ) => {
    try {
      setLoading(true);
      const loggedInUserId = sessionStorage.getItem("userId");
      const response = await axios.get(`${BASE_URL}/networking`, {
        params: {
          pageNumber: pageNumber,
        },
      });

      const { users, totalCount } = response.data;

      // Filter users based on different types of connections if required
      let filteredUsers = users;
      if (filterByMyConnections) {
        filteredUsers = users.filter((user: any) =>
          userConnections.myConnections.includes(user.uid)
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (filterByRequestSent) {
        filteredUsers = users.filter((user: any) =>
          userConnections.requestSent.includes(user.uid)
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (filterByRequestReceived) {
        filteredUsers = users.filter((user: any) =>
          userConnections.requestReceived.includes(user.uid)
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (filteredUsers.length == 0) {
        setShowMessage(true);
      }

      if (loggedInUserId) {
        filteredUsers = filteredUsers.filter(
          (user: any) => user.uid !== loggedInUserId
        );
      }

      // Additional condition to filter users based on search term
      if (searchTerm.trim() !== "") {
        filteredUsers = filteredUsers.filter((user: any) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      const updatedSortedUsers = filteredUsers.map((user: any) => {
        // Check if user's UID is in requestSent, requestReceived, or myConnections
        if (userConnections.requestSent.includes(user.uid)) {
          user.flag = "rs";
        } else if (userConnections.requestReceived.includes(user.uid)) {
          user.flag = "rc";
        } else if (userConnections.myConnections.includes(user.uid)) {
          user.flag = "mc";
        } else {
          user.flag = "f";
        }
        return user;
      });

      const newPaginatedUsers = [];
      for (let i = 0; i < updatedSortedUsers.length; i += usersPerRow) {
        newPaginatedUsers.push(updatedSortedUsers.slice(i, i + usersPerRow));
      }
      setPaginatedUsers(newPaginatedUsers);

      setTotalCount(totalCount);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  // function to apply my connection filter.
  const handleMyConnectionsClick = () => {
    setSortBy("myconnections");
    setPageNumber(1);
    setFilterByMyConnections(true);
    setFilterByRequestSent(false);
    setFilterByRequestReceived(false);
    fetchData(1, true, false, false);
  };

  // function to apply request sent filter.
  const handleRequestSentClick = () => {
    setSortBy("requestsent");
    setPageNumber(1);
    setFilterByMyConnections(false);
    setFilterByRequestSent(true);
    setFilterByRequestReceived(false);
    fetchData(1, false, true, false);
  };

  // function to received request filter.
  const handleRequestReceivedClick = () => {
    setSortBy("requestreceived");
    setPageNumber(1);
    setFilterByMyConnections(false);
    setFilterByRequestSent(false);
    setFilterByRequestReceived(true);
    fetchData(1, false, false, true);
  };

  // function to show all users.
  const ShowAll = () => {
    setSortBy("showall");
    setPageNumber(1);
    setFilterByMyConnections(false);
    setFilterByRequestSent(false);
    setFilterByRequestReceived(false);
    fetchData(1, false, false, false);
  };

  const handleClick = (userId: string, flag: string) => {
    setSelectedUserId(userId);
    setSelectedAction(flag);
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  // function to perform different actions like chat/send request/accept request/reject request.
  const handleProceed = () => {
    if (selectedAction === "mc") {
      navigate("/messages", { state: { receiverId: selectedUserId } });
    } else {
      handleSendConnection(selectedUserId, selectedAction);
    }
    setConfirmationOpen(false);
  };

  // function to update connection request.
  const handleSendConnection = async (userUid: string, flag: string) => {
    try {
      const loggedInUserId = sessionStorage.getItem("userId");
      if (!loggedInUserId) {
        console.error("User not logged in");
        return;
      }
      let apiUrl = "";
      switch (flag) {
        case "rs":
          apiUrl = `${BASE_URL}/networking/handleRequestSent`;
          break;
        case "rc":
          apiUrl = `${BASE_URL}/networking/handleRequestReceivedAccept`;
          break;
        case "rm":
          apiUrl = `${BASE_URL}/networking/handleMyConnection`;
          break;
        case "rj":
          apiUrl = `${BASE_URL}/networking/handleRequestReceivedReject`;
          break;
        default:
          apiUrl = `${BASE_URL}/networking/sendConnectionRequest`;
      }

      const response = await axios.post(apiUrl, {
        userUid: userUid,
        loggedInUserId: loggedInUserId,
      });
      console.log(response.data);
      setSendConnection(response.data);
      console.log(sendconnection);
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  // function to change page number.
  const handlePageChange = (page: number) => {
    setPageNumber(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // function which fetch the users.
    const fetchUserConnections = async () => {
      try {
        // API to fetch user connections data
        const uid = sessionStorage.getItem("userId");
        console.log(uid);

        const response = await axios.get(
          `${BASE_URL}/networking/userconnections`,
          {
            params: {
              uid: uid,
            },
          }
        );

        setUserConnections(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user connections:", error);
      }
    };

    fetchUserConnections();
  }, [sendconnection]);

  useEffect(() => {
    function handleResize() {
      // Determine the number of users to display per row based on screen size range
      if (window.innerWidth <= 500) {
        setUsersPerRow(1);
      } else if (window.innerWidth <= 1000) {
        setUsersPerRow(2);
      } else if (window.innerWidth <= 1500) {
        setUsersPerRow(4);
      } else {
        setUsersPerRow(5);
      }
    }

    // Initial call
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchData(
      pageNumber,
      filterByMyConnections,
      filterByRequestSent,
      filterByRequestReceived
    );
    return () => {};
  }, [pageNumber, usersPerRow, userConnections, sendconnection, searchTerm]);

  return (
    <>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Loading spinner */}
        {loading && (
          <CircularProgress
            style={{ position: "absolute", top: "50%", left: "50%" , zIndex : "5"}}
          />
        )}
        <div>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: "center",
                marginBottom: "20px",
                gap: "10px",
              }}
            >
              {/* Search bar */}
              <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ borderRadius: "4px", width: "100%" }}
              />

              {/* Sort By filter */}
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as string)}
                displayEmpty
                inputProps={{ "aria-label": "Sort By" }}
                sx={{
                  borderRadius: "4px",
                  minWidth: isSmallScreen ? "0px" : "300px",
                }}
              >
                <MenuItem
                  value="myconnections"
                  onClick={handleMyConnectionsClick}
                >
                  My Connections
                </MenuItem>
                <MenuItem value="requestsent" onClick={handleRequestSentClick}>
                  Connection Requests Sent
                </MenuItem>
                <MenuItem
                  value="requestreceived"
                  onClick={handleRequestReceivedClick}
                >
                  Connections Requests Received
                </MenuItem>
                <MenuItem value="showall" onClick={ShowAll}>
                  Show All
                </MenuItem>
              </Select>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              {/* User information card */}
              {paginatedUsers.length > 0 &&
                paginatedUsers.map((userGroup: any[]) =>
                  userGroup.map((user: any) => (
                    <Card
                      key={user.uid}
                      sx={{
                        width: "300px",
                        margin: "16px",
                        padding: "2%",
                      }}
                    >
                      {" "}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "100%",
                        }}
                      >
                        <Avatar
                          src={user.image}
                          sx={{ width: 140, height: 140 }}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            align="center"
                          >
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                          >
                            {user.profession
                              ? user.profession
                              : "Profession not available "}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                          >
                            {user.companyName
                              ? user.companyName
                              : "Company not available"}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center" }}>
                          {user.flag === "rc" && (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                style={{
                                  color: "green",
                                  borderColor: "green",
                                  marginRight: "8px",
                                }}
                                onClick={() => handleClick(user.uid, user.flag)}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                style={{ color: "red", borderColor: "red" }}
                                onClick={() => handleClick(user.uid, "rj")}
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          {user.flag === "mc" && (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                style={{ marginRight: "8px" }}
                                onClick={() => handleClick(user.uid, user.flag)}
                              >
                                Message
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                style={{ color: "red", borderColor: "red" }}
                                onClick={() => handleClick(user.uid, "rm")}
                              >
                                Remove
                              </Button>
                            </>
                          )}
                          {user.flag !== "rc" && user.flag !== "mc" && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleClick(user.uid, user.flag)}
                            >
                              {user.flag === "f" && "Send Connection Request"}
                              {user.flag === "rs" &&
                                "Request Sent, Click Again to Cancel"}
                            </Button>
                          )}
                        </CardActions>
                      </Box>
                    </Card>
                  ))
                )}
            </Box>
          </Box>

          {/* Confirmation dialog */}
          <Dialog
            open={confirmationOpen}
            onClose={() => setConfirmationOpen(false)}
          >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to proceed?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmationClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleProceed} color="primary" autoFocus>
                Proceed
              </Button>
            </DialogActions>
          </Dialog>

          {/* Pagination */}
          {paginatedUsers.length > 0 ? (
            <Pagination
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              // Calculate total pages using total count
              count={Math.ceil(totalCount / 12)}
              page={pageNumber}
              onChange={(_event, page) => handlePageChange(page)}
            />
          ) : null}

          {/* Empty user list message */}
          {showMessage && (
            <Typography
              variant="h4"
              align="center"
              style={{ marginTop: "15%" }}
            >
              No users available for the selected filter criteria.
            </Typography>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvanceNetworkPage;
