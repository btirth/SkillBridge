import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";
import { useEffect } from "react";
import {
  Box,
  Pagination,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatDate } from "../../utils/helpers";
import { theme } from "../../utils/theme";
import dayjs from "dayjs";

const TransactionsPage = observer(() => {
  const { paymentsStore } = useStores();
  const { transactions, transactionsParams, isTransactionsLoading } =
    paymentsStore;

  console.log(transactions);

  useEffect(() => {
    paymentsStore.fetchTransactions();
  }, []);

  const tableHeaders: TableHeader[] = [
    { label: "Description", align: "left" },
    { label: "Card", align: "left" },
    { label: "Date", align: "left" },
    { label: "Amount", align: "right" },
  ];

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    paymentsStore.updateTransactionParams({ page: value });
    paymentsStore.fetchTransactions();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={header.label + index} align={header.align}>
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isTransactionsLoading ? (
              [1, 2, 3, 4, 5, 6, 7].map((value, index) => (
                <TableRow key={value + index}>
                  <TableCell
                    colSpan={4}
                    align="center"
                    component="th"
                    padding="none"
                    sx={{ padding: "5px" }}
                  >
                    <Skeleton variant="rectangular" height={45}></Skeleton>
                  </TableCell>
                </TableRow>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:nth-of-type(odd)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell component="th" sx={{ fontWeight: 500 }}>
                    {transaction.description.slice(0, 20)}
                  </TableCell>
                  <TableCell align="left">
                    {transaction.cardLast4
                      ? `**** ${transaction.cardLast4}`
                      : ""}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {formatDate(dayjs(transaction.createdAt))}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "table-cell", sm: "none" } }}
                  >
                    {formatDate(dayjs(transaction.createdAt), "MM/DD/YYYY")}
                  </TableCell>
                  <TableCell
                    component="th"
                    align="right"
                    sx={{ fontWeight: 500 }}
                  >
                    ${transaction.amount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" component="th">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={transactionsParams.totalPages}
        page={transactionsParams.page}
        onChange={handlePageChange}
        color="primary"
      />
    </Box>
  );
});

interface TableHeader {
  label: string;
  align: "right" | "left" | "center" | "inherit" | "justify";
}

export default TransactionsPage;
