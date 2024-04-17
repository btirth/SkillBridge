import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import PaymentForm from "../../components/payment-form/PaymentForm";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentSuccessDialog from "../../components/payment-success-dialog/PaymentSuccessDialog";
import { AxiosError } from "axios";

const PaymentPage = observer(() => {
  const { paymentsStore, bookingStore } = useStores();
  const { payment, paymentDetails } = paymentsStore;
  const navigate = useNavigate();
  const location = useLocation();

  const [isPaymentSuccessful, setPaymentSuccessful] = useState(false);

  useEffect(() => {
    paymentsStore.fetchSavedCards();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await paymentsStore.pay();
      if (response.status === 201) {
        setPaymentSuccessful(true);
        await bookingStore.addMentorBooking(response.data.id);
        paymentsStore.resetPayment();
        bookingStore.resetBookMentor();
        setTimeout(() => {
          navigate(location?.state?.redirectUrl ?? "/");
        }, 1000);
      }
      return response;
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }, unknown>).response?.data
          ?.message ?? "Invalid card details"
      );
    }
  };

  const handleBack = () => {
    paymentsStore.resetPayment();
    navigate(location.state?.prevUrl ?? "/");
  };

  return (
    <Container sx={{ pt: { xs: 1, sm: 3 } }}>
      <PaymentSuccessDialog open={isPaymentSuccessful} />
      <ToastContainer />
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={7}
          display="flex"
          flexDirection="column"
          gap={1}
          alignItems="flex-start"
        >
          <Button startIcon={<ArrowBack />} onClick={handleBack}>
            Go back
          </Button>
          <Typography variant="h6">{paymentDetails.name}</Typography>
          <Typography variant="body1">
            Amount: ${paymentDetails.amount}
          </Typography>
          <Typography variant="body1">
            Tax: ${((paymentDetails.amount ?? 0) * 0.15).toFixed(2)}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            Total: ${payment.amount}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {paymentDetails.paymentInfo}
          </Typography>
          <Typography variant="body1">{paymentDetails.description}</Typography>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Paper elevation={2} sx={{ px: 2, py: 3 }}>
            <PaymentForm
              isPayment={true}
              onSubmit={handleSubmit}
              clearErrors={!!payment.paymentMethodId}
              showConfirmation={true}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
});

export default PaymentPage;
