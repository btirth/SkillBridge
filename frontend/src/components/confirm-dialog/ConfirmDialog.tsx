import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Dialog, Typography } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  message?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ConfirmDialog = ({
  open,
  message,
  onSubmit,
  onCancel,
  isLoading,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={{ xs: 3, sm: 10 }}
      >
        <Typography variant="h5" mt={2} textAlign="center">
          {message ?? "Proceed?"}
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          justifyContent="center"
          gap={1}
          mt={5}
        >
          <Button
            type="button"
            onClick={onCancel}
            variant="outlined"
            sx={{ width: "100%", maxWidth: "200px" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            type="button"
            onClick={onSubmit}
            variant="contained"
            sx={{ width: "100%", maxWidth: "200px" }}
          >
            Proceed
          </LoadingButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;
