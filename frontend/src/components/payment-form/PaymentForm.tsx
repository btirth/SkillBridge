import {
  Box,
  FormControl,
  Grid,
  OutlinedInput,
  Skeleton,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { useStores } from "../../stores/RootStore";
import SavedCard from "../saved-card/SavedCard";
import { observer } from "mobx-react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from "@stripe/stripe-js";
import ConfirmDialog from "../confirm-dialog/ConfirmDialog";

interface PaymentFormProps {
  buttonText?: string;
  onSubmit?: (paymentMethodId: string) => void;
  isPayment?: boolean;
  clearErrors?: boolean;
  showConfirmation?: boolean;
}

const PaymentForm = observer(
  ({
    buttonText,
    onSubmit,
    isPayment,
    clearErrors,
    showConfirmation,
  }: PaymentFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const { paymentsStore } = useStores();
    const { cards, payment, isCardsLoading } = paymentsStore;
    const [isLoading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [errors, setErrors] = useState<{
      cardNumber: string | undefined;
      cardExpiry: string | undefined;
      cardCvc: string | undefined;
      postalCode: string | undefined;
    }>({
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      postalCode: "",
    });
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const valid = !(
      errors.cardExpiry ||
      errors.cardCvc ||
      errors.cardNumber ||
      errors.postalCode
    );

    useEffect(() => {
      if (clearErrors || valid) {
        clearFormErrors();
      }
    }, [clearErrors, valid]);

    const clearFormErrors = () => {
      setErrors({
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
        postalCode: "",
      });
      setFormError("");
    };

    const handlePayment = async () => {
      if (onSubmit) {
        setLoading(true);
        await onSubmit(paymentsStore.payment.paymentMethodId);
        setLoading(false);
        paymentsStore.resetPayment();
      }
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const postalCode = form.elements.namedItem(
        "postalCode"
      ) as HTMLInputElement;

      if (paymentsStore.payment.paymentMethodId) {
        clearFormErrors();
        if (onSubmit) {
          try {
            if (showConfirmation) {
              setShowConfirmationDialog(true);
            } else {
              handlePayment();
            }
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response?.data) {
              const { message } = axiosError.response.data;
              toast.error(message);
            }
          }
        }
        return;
      }

      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements.getElement(CardNumberElement)!;
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (!postalCode.value) {
        setErrors((errors) => {
          return { ...errors, postalCode: "Enter the postal code" };
        });
      }

      if (error || !postalCode.value) {
        setFormError("Invalid card details");
      } else {
        clearFormErrors();
        if (onSubmit) {
          paymentsStore.updatePayment({ paymentMethodId: paymentMethod.id });
          if (showConfirmation) {
            setShowConfirmationDialog(true);
          } else {
            handlePayment();
          }
        }
      }
    };

    const handleCardElementChange = (
      event:
        | StripeCardExpiryElementChangeEvent
        | StripeCardCvcElementChangeEvent
        | StripeCardNumberElementChangeEvent
    ) => {
      setErrors((errors) => {
        return { ...errors, [event.elementType]: event.error?.message ?? "" };
      });
    };

    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        gap={2}
      >
        <ConfirmDialog
          open={showConfirmationDialog}
          message={` This payment is not refundable. Do you want to proceed with payment $${paymentsStore.paymentDetails.amount}?`}
          onSubmit={handlePayment}
          onCancel={() => setShowConfirmationDialog(false)}
          isLoading={isLoading}
        />
        {isPayment ? (
          isCardsLoading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={70}
              sx={{ maxWidth: 500 }}
            />
          ) : (
            cards.map((card, index) => (
              <SavedCard
                key={card.id + index}
                {...card}
                isClickable={true}
                isActive={payment.paymentMethodId === card.id}
                handleClick={() => {
                  if (paymentsStore.payment.paymentMethodId === card.id) {
                    paymentsStore.updatePayment({ paymentMethodId: "" });
                  } else {
                    paymentsStore.updatePayment({ paymentMethodId: card.id });
                  }
                }}
                hideDelete={true}
              />
            ))
          )
        ) : null}
        <Box>
          <Box
            sx={
              errors.cardNumber
                ? ERROR_INPUT_WRAPPER_STYLE
                : INPUT_WRAPPER_STYLE
            }
          >
            <CardNumberElement
              onFocus={() =>
                paymentsStore.updatePayment({ paymentMethodId: "" })
              }
              options={{ ...CARD_OPTIONS, showIcon: true, iconStyle: "solid" }}
              onChange={handleCardElementChange}
            />
          </Box>
          {errors.cardNumber ? (
            <Typography fontSize={12} color="#fa755a">
              {errors.cardNumber}
            </Typography>
          ) : null}
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box
              sx={
                errors.cardExpiry
                  ? ERROR_INPUT_WRAPPER_STYLE
                  : INPUT_WRAPPER_STYLE
              }
            >
              <CardExpiryElement
                options={CARD_OPTIONS}
                onChange={handleCardElementChange}
              />
            </Box>
            {errors.cardExpiry ? (
              <Typography fontSize={12} color="#fa755a">
                {errors.cardExpiry}
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={
                errors.cardCvc ? ERROR_INPUT_WRAPPER_STYLE : INPUT_WRAPPER_STYLE
              }
            >
              <CardCvcElement
                options={CARD_OPTIONS}
                onChange={handleCardElementChange}
              />
            </Box>
            {errors.cardCvc ? (
              <Typography fontSize={12} color="#fa755a">
                {errors.cardCvc}
              </Typography>
            ) : null}
          </Grid>
        </Grid>
        <FormControl>
          <OutlinedInput
            placeholder="Postal code"
            name="postalCode"
            onChange={(e) => {
              if (e.target.value) {
                setErrors((errors) => {
                  return { ...errors, postalCode: "" };
                });
              }
            }}
          />
          {errors.postalCode ? (
            <Typography fontSize={12} color="#fa755a">
              {errors.postalCode}
            </Typography>
          ) : null}
        </FormControl>
        {formError ? (
          <Typography fontSize={12} color="#fa755a" m="0 auto">
            {formError}
          </Typography>
        ) : null}
        <LoadingButton
          variant="contained"
          type="submit"
          fullWidth
          sx={{ maxWidth: "300px", m: "0 auto" }}
          loading={isLoading}
          disabled={
            !!(
              errors.cardExpiry ||
              errors.cardCvc ||
              errors.cardNumber ||
              errors.postalCode
            )
          }
        >
          {buttonText ?? "Pay"}
        </LoadingButton>
      </Box>
    );
  }
);

// Styles for Grid containing Stripe card elements
const INPUT_WRAPPER_STYLE = {
  p: "18px 10px",
  border: "1px solid #a6a6a6",
  borderRadius: 1,
  ":hover": {
    border: "1px solid black",
  },
  ":visited": {
    border: "1px solid black",
  },
};

const ERROR_INPUT_WRAPPER_STYLE = {
  ...INPUT_WRAPPER_STYLE,
  border: "1px solid #fa755a",
};

// Styling each stripe element referenced from https://www.linkedin.com/pulse/stripe-custom-styled-card-elements-tanjir-antu/
const CARD_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Roboto, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
      border: "1px solid black",
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default PaymentForm;
