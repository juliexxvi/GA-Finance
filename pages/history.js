import {
  CircularProgress,
  Container,
  Grid,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableHead,
  Paper,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import Header from "../components/Header";
import { useRouter } from "next/router";
import Disclaimer from "../components/Disclaimer";
import { useEffect, useState } from "react";
import { getHistory } from "../utils/helpers";

export default function History() {
  const [user, loading] = useAuthState(firebase.auth());
  const router = useRouter();

  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    if (user && !loading) {
      getHistory(user.uid).then((data) => setTransactions(data));
    }
  }, [user]);

  if (!loading && !user) {
    router.push("/");
    return <></>;
  }

  if (loading || !transactions) {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 2 }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Container>
      <Header />
      <TableContainer component={Paper} sx={{ mt: 6 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Symbol
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Shares
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Transacted
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{transaction.symbol}</TableCell>
                <TableCell align="center">
                  {transaction.transactionType == "BUY" ? "+" : "-"}
                  {transaction.shares}
                </TableCell>
                <TableCell align="center">
                  ${transaction.price.toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  {transaction.date.toLocaleString("en-GB")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Disclaimer />
    </Container>
  );
}
