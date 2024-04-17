import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
} from "@mui/material";

// Define the criteria type
type Criteria = {
  id:
    | "clarity"
    | "professionalism"
    | "communication"
    | "goalAchievement"
    | "overallExperience";
  label: string;
};

// A specific type for the selectedValues state
type SelectedValues = {
  [key in Criteria["id"]]?: string;
};

const criteriaList: Criteria[] = [
  { id: "clarity", label: "Clarity of Guidance Provided" },
  { id: "professionalism", label: "Professionalism and Conduct" },
  { id: "communication", label: "Effectiveness of Communication" },
  { id: "goalAchievement", label: "Mentorship Goals Achievement" },
  { id: "overallExperience", label: "Overall Experience" },
];

type RatingTableProps = {
  onAverageRatingCalculated: (average: number) => void;
};

const RatingTable: React.FC<RatingTableProps> = ({
  onAverageRatingCalculated,
}) => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({});

  // Function to handle the radio button change
  const handleRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    criteriaId: Criteria["id"]
  ) => {
    const newValue = event.target.value;
    setSelectedValues({ ...selectedValues, [criteriaId]: newValue });
  };

  // Effect to log the selected values
  useEffect(() => {
    const allRated = criteriaList.every(
      (criteria) => selectedValues[criteria.id]
    );

    if (allRated) {
      const sum = criteriaList.reduce((acc, criteria) => {
        return acc + parseFloat(selectedValues[criteria.id] || "0");
      }, 0);

      const average = sum / criteriaList.length;
      const roundedAverage = Math.round(average * 2) / 2;

      // Use the callback function to pass the rounded average up to the parent component
      onAverageRatingCalculated(roundedAverage);
    }
  }, [selectedValues, onAverageRatingCalculated]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="feedback table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#89CFF0" }}>
            <TableCell />
            {[1, 2, 3, 4, 5].map((number) => (
              <TableCell key={number} align="center">
                {number}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {criteriaList.map((criteria) => (
            <TableRow key={criteria.id}>
              <TableCell component="th" scope="row">
                {criteria.label}
              </TableCell>
              {[1, 2, 3, 4, 5].map((value) => (
                <TableCell key={value} align="center">
                  <Radio
                    checked={selectedValues[criteria.id] === String(value)}
                    onChange={(e) => handleRadioChange(e, criteria.id)}
                    value={String(value)}
                    name={criteria.id}
                    color="primary"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RatingTable;
