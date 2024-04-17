import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MentorCard from "../MentorCard/MentorCard";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";
import { Mentor } from "../../models/Mentors.model";

type MentorListProps = {
  mentors: Mentor[];
  filters: Filters;
  searchInput: string;
};

const MentorList: React.FC<MentorListProps> = observer(
  ({ mentors, filters, searchInput }) => {
    const itemsPerPage = 3;
    const [page, setPage] = useState(1);
    const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
    const [totalPages, setTotalPages] = useState(0);

    const { userStore } = useStores();
    const { userDetails } = userStore;

    useEffect(() => {
      const newFilteredMentors = mentors.filter((mentor) => {
        const name = mentor.firstName + " " + mentor.lastName;
        const matchesName = name
          .toLowerCase()
          .includes(searchInput.toLowerCase());
        const mentorExpertiseArray = mentor.expertise
          .split(", ")
          .map((e) => e.trim());
        const matchesExpertise =
          filters.areaOfExpertise.length === 0 ||
          filters.areaOfExpertise.some((expertise) =>
            mentorExpertiseArray.includes(expertise)
          );
        const matchesExperience =
          parseInt(mentor.experience) >= filters.experience;
        const matchesRatings = parseFloat(mentor.ratings) >= filters.ratings;
        const matchesGender =
          filters.gender === "" || mentor.gender === filters.gender;

        const isCurrentUser = userDetails.email === mentor.email;

        return (
          matchesExpertise &&
          matchesExperience &&
          matchesRatings &&
          matchesGender &&
          matchesName &&
          !isCurrentUser
        );
      });

      setFilteredMentors(newFilteredMentors);
      setPage(1); // Reset to first page when filters change
      setTotalPages(Math.ceil(newFilteredMentors.length / itemsPerPage));
    }, [mentors, filters, searchInput, itemsPerPage, userDetails]);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      console.log(event);
      setPage(value);
    };

    // Calculate the current items to display
    const currentItems = filteredMentors.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    return (
      <Box>
        <Box sx={{ overflowX: "auto" }}>
          <Grid container spacing={2}>
            {currentItems.map((mentor) => (
              <Grid item key={mentor.id} xs={12}>
                <MentorCard {...mentor} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Stack spacing={1} alignItems="center" marginTop={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChange}
            color="primary"
          />
        </Stack>
      </Box>
    );
  }
);

export default MentorList;
