import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import SavedCardsPage from "../saved-cards-page/SavedCardsPage";
import CustomTabPanel from "../../components/custom-tab-panel/CustomTabPanel";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";
import TransactionsPage from "../transactions-page/TransactionsPage";
import { ToastContainer } from "react-toastify";

const TranasactionsCardsPage = observer(() => {
  const [tab, setTab] = useState(0);

  const { paymentsStore } = useStores();

  const handleChange = (_event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  useEffect(() => {
    paymentsStore.fetchSavedCards();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <ToastContainer />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Saved cards" {...a11yProps(0)} />
          <Tab label="Transactions" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tab} index={0}>
        <SavedCardsPage />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <TransactionsPage />
      </CustomTabPanel>
    </Box>
  );
});

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default TranasactionsCardsPage;
