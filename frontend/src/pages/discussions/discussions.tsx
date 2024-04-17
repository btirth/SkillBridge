/**
 * @author Tirth Bharatiya (B00955618)
 */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  InputBase,
  IconButton,
  Select,
  MenuItem,
  Typography,
  Pagination,
  SelectChangeEvent,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { fetchDiscussions } from "./discussion";
import {
  DiscussionModel,
  DiscussionSearchAndFilterModel,
} from "../../models/discussions.model";
import DiscussionCard from "../../components/Discussion/DiscussionCard";
import { theme } from "../../utils/theme";

const DiscussionsPage = () => {
  const [loading, setloading] = useState(false);
  const [discussions, setDiscussions] = useState<DiscussionModel[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "mostLiked">(
    "newest"
  );
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState<boolean>(false);

  // Fetch list of discussions based on search and sort criteria
  useEffect(() => {
    updateDiscussions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sortBy, page]);

  // function responsible to update the discussions
  const updateDiscussions = () => {
    const searchAndFilter: DiscussionSearchAndFilterModel = {
      searchText,
      sortBy,
    };
    setloading(true);
    fetchDiscussions(searchAndFilter, page)
      .then((response) => {
        if (response.status === 200) {
          setDiscussions(response.data.discussions);
          setTotalPage(response.data.totalPages);
        } else {
          setError(true);
        }
        setloading(false);
      })
      .catch(() => {
        setloading(false);
        setError(true);
      });
  };

  // Function responsible to handle search button
  const applySearch = () => {
    setPage(1);
    updateDiscussions();
  };

  // function responsible to change the page
  const changePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // function responsible to change sortBy
  const changeSortBy = (
    event: SelectChangeEvent<"newest" | "oldest" | "mostLiked">
  ) => {
    // when user changes sort by preference, redirect them to 1st page of discussion after applying sort by opertaion
    setPage(1);
    setSortBy(event.target.value as "newest" | "oldest" | "mostLiked");
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: "lg",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">Discussions</Typography>
          <Link
            to={"/discussions/new"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button color="primary" type="submit" variant="contained">
              {isSmallScreen ? "+" : "Start a Discussion"}
            </Button>
          </Link>
        </Box>

        {/* Search and Sort By options */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: isSmallScreen ? "flex-start" : "center",
          }}
        >
          {/* Search bar */}
          <Box
            sx={{
              maxWidth: "950px",
              display: "flex",
              flexDirection: "row",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
              padding: "5px",
              paddingLeft: "10px",
              paddingRight: "10px",
              marginRight: "10px",
              paddingTop: "5px",
            }}
          >
            <InputBase
              sx={{ ml: "1px", flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
              inputProps={{ "aria-label": "search", autoComplete: "true" }}
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={applySearch}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          {/* Sort by options */}
          <Box
            sx={{
              paddingTop: isSmallScreen ? "5px" : "0px",
              flexGrow: 1,
              minWidth: "160px",
            }}
          >
            <Select
              labelId="filter-label"
              value={sortBy}
              onChange={changeSortBy}
              fullWidth
            >
              <MenuItem value="newest">Newest first</MenuItem>
              <MenuItem value="oldest">Oldest first</MenuItem>
              <MenuItem value="mostLiked">Most Liked first</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: "10px",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            minHeight: "100vh"
          }}
        >
          {/* Conditionally rendering loading, error and list of discussions */}
          {loading && (
            <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
              <CircularProgress />
              <Typography>Loading...</Typography>
            </Box>
          )}
          {error ? (
            <Box>
              <Typography variant="h5">
                <b>Something went wrong. Please try again later...</b>
              </Typography>
            </Box>
          ) : (
            discussions.map((discussion) => (
              <div key={discussion.id} style={{ width: "100%" }}>
                <DiscussionCard discussion={discussion} />
              </div>
            ))
          )}

          {/* Pagination */}
          <Pagination count={totalPage} page={page} onChange={changePage} />
        </Box>
      </Box>
    </>
  );
};

export default DiscussionsPage;
