import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import visaIcon from "../../assets/cc-visa.png";
import mcIcon from "../../assets/cc-mastercard.svg";
import { Delete } from "@mui/icons-material";

interface SavedCardProps {
  id: string;
  brand: string;
  exp_month: string;
  exp_year: string;
  last4: string;
  isClickable?: boolean;
  isActive?: boolean;
  handleClick?: (id: string) => void;
  onDeleteCard?: (id: string) => void;
  hideDelete?: boolean;
}

const SavedCard = ({
  id,
  brand,
  exp_month,
  exp_year,
  last4,
  isClickable,
  isActive,
  handleClick,
  onDeleteCard,
  hideDelete,
}: SavedCardProps) => {
  return (
    <Paper
      elevation={2}
      onClick={() => (handleClick ? handleClick(id) : null)}
      sx={{
        position: "relative",
        p: { xs: "15px 10px", md: "15px 20px" },
        maxWidth: 500,
        backgroundColor: isActive ? "#cacaca" : "white",
        cursor: isClickable ? "pointer" : "auto",
        ":hover": { backgroundColor: isClickable ? "#cacaca" : "white" },
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          display="flex"
          alignItems="center"
          p="6px 2px"
          border="1px solid gray"
          borderRadius={1}
          sx={{ backgroundColor: brand === "visa" ? "transparent" : "black" }}
          width={40}
          height={30}
        >
          <img src={brand === "visa" ? visaIcon : mcIcon} width="100%"></img>
        </Box>
        <Box
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography
            variant="body1"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            **** **** **** {last4}
          </Typography>
          <Typography variant="body2" sx={{ display: { md: "none" } }}>
            **** **** {last4}
          </Typography>

          <Typography
            variant="body1"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {exp_month}/{exp_year}
          </Typography>
          <Typography variant="body2" sx={{ display: { md: "none" } }}>
            {exp_month}/{exp_year}
          </Typography>
        </Box>
        {!hideDelete ? (
          <Box m="0 auto" mr={0}>
            <Tooltip title="Delete card">
              <IconButton
                aria-label="delete"
                onClick={() => (onDeleteCard ? onDeleteCard(id) : null)}
                size="small"
                sx={{
                  color: "red",
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
};

export default SavedCard;
