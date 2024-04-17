import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import AddCardDialog from "../../components/add-card-dialog/AddCardDialog";
import SavedCard from "../../components/saved-card/SavedCard";
import { AddCircle } from "@mui/icons-material";
import { useStores } from "../../stores/RootStore";
import { observer } from "mobx-react";

const SavedCardsPage = observer(() => {
  const [isAddCardOpen, setAddCardOpen] = useState(false);

  const { paymentsStore } = useStores();
  const { cards, isCardsLoading } = paymentsStore;

  const handleModalClose = () => {
    setAddCardOpen(false);
  };

  const handleDeleteCard = async (paymentMethodId: string) => {
    const response = await paymentsStore.deleteCard(paymentMethodId);
    console.log(response);
  };

  return (
    <Box maxWidth={500} m="0 auto" pt={{ xs: 2, md: 0 }}>
      <AddCardDialog handleClose={handleModalClose} isOpen={isAddCardOpen} />
      <Box
        mb={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" fontWeight={500}>
          Saved Cards
        </Typography>
        <Button
          type="button"
          variant="contained"
          size="small"
          startIcon={<AddCircle />}
          onClick={() => setAddCardOpen(true)}
        >
          Add Card
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" gap={2} minHeight={400}>
        {isCardsLoading ? (
          [1, 2, 3].map((value) => (
            <Skeleton
              key={`skeleton-card-${value}`}
              variant="rectangular"
              width="100%"
              height={70}
              sx={{ maxWidth: 500 }}
            />
          ))
        ) : cards.length > 0 ? (
          cards.map((card, index) => (
            <SavedCard
              key={card.id + index}
              {...card}
              onDeleteCard={handleDeleteCard}
            />
          ))
        ) : (
          <Box minHeight={300}>
            <Typography>No saved cards available!</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

export default SavedCardsPage;
