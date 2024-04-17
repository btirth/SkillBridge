import { Box, Dialog, Typography } from "@mui/material";
import SuccessIcon from "../../assets/circle-check-solid.svg";

const PaymentSuccessDialog = ({
  open,
  successText,
}: {
  open: boolean;
  successText?: string;
}) => {
  return (
    <Dialog open={open}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={{ xs: 3, sm: 10 }}
      >
        <img src={SuccessIcon} width={100} />
        <Typography variant="h5" mt={2}>
          {successText ?? "Payment Successful"}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default PaymentSuccessDialog;
