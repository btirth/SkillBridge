import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  FormControl,
  Select,
  MenuItem,
  FormGroup,
  Paper,
  OutlinedInput,
  SelectChangeEvent,
  Chip,
  Divider,
  TextField,
  Rating,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const subjects = [
  "Data Science",
  "Python",
  "Machine Learning",
  "Web Development",
  "JavaScript",
  "React",
  "UI/UX Design",
  "Figma",
  "Adobe XD",
  "Cloud Computing",
  "AWS",
  "Azure",
  "Graphic Design",
  "Illustrator",
  "Photoshop",
  "Cybersecurity",
  "Network Security",
  "Ethical Hacking",
  "Mobile App Development",
  "Flutter",
  "React Native",
  "Big Data",
  "Hadoop",
  "Spark",
  "SEO",
  "Digital Marketing",
  "Content Writing",
  "Project Management",
  "Agile",
  "Scrum",
];

interface SearchFilterProps {
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

function SearchFilter({ setFilters, setSearchInput }: SearchFilterProps) {
  const [areaOfExpertise, setAreaOfExpertise] = useState<string[]>([]);
  const [experience, setExperience] = useState(0);
  const [ratings, setRatings] = useState(0);
  const [gender, setGender] = useState("");

  const handleSearch = () => {
    setFilters({
      areaOfExpertise,
      experience,
      ratings,
      gender,
    });
    // console.log("areaOfExpertise : ", areaOfExpertise);
    // console.log("experience: ", experience);
    // console.log("ratings: ", ratings);
    // console.log("gender:", gender);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchInput(e.target.value);
  };

  const handleRatingsChange = (
    _event: React.ChangeEvent<object>,
    newValue: number | null
  ) => {
    setRatings(newValue || 0);
  };

  const handleChange = (event: SelectChangeEvent<typeof areaOfExpertise>) => {
    const value = event.target.value;
    setAreaOfExpertise(typeof value === "string" ? value.split(",") : value);
  };

  const handleExperienceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExperience(parseInt(event.target.value, 10));
  };

  return (
    <Paper
      sx={{
        padding: 2,
        borderRadius: "10px",
      }}
    >
      <Box>
        <Typography variant="h6">Filters</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormGroup>
          <Typography id="searchText" gutterBottom sx={{ mb: 1 }}>
            Search by Name
          </Typography>
          <TextField
            fullWidth
            id="searchName"
            onChange={handleSearchInputChange}
          />

          <Box sx={{ mt: 2 }}>
            <Typography id="AreaOfExpertiseText" gutterBottom sx={{ mb: 1 }}>
              Area of Expertise
            </Typography>
            <FormControl fullWidth>
              <Select
                id="expertise"
                name="expertise"
                multiple
                value={areaOfExpertise}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {subjects.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography id="experienceText" gutterBottom sx={{ mb: 1 }}>
              Experience
            </Typography>
            <TextField
              fullWidth
              name="experience"
              type="number"
              id="experience"
              value={experience}
              onChange={handleExperienceChange}
            />
          </Box>

          <Box>
            <Typography id="GenderSelect" gutterBottom sx={{ mt: 2 }}>
              Gender
            </Typography>
            <FormControl fullWidth>
              <Select
                labelId="gender-label"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography id="RatingSelect" gutterBottom sx={{ mt: 2 }}>
              Ratings
            </Typography>
            <Rating
              size="large"
              name="simple-controlled"
              value={ratings}
              onChange={handleRatingsChange}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </FormGroup>
      </Box>
    </Paper>
  );
}

export default SearchFilter;
