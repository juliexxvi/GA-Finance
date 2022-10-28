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
import { getDashboardHoldings } from "../utils/helpers";

export default function Dashboard() {
  const [user, loading] = useAuthState(firebase.auth());
  const router = useRouter();

  const [holdings, setHoldings] = useState(null);
  const [total, setTotal] = useState();

  useEffect(() => {
    if (user && !loading) {
      getDashboardHoldings(user.uid).then(({ rows, holdingsTotal }) => {
        setHoldings(rows);
        setTotal(holdingsTotal);
      });
    }
  }, [user]);

  if (!loading && !user) {
    router.push("/");
    return <></>;
  }

  if (loading || !holdings) {
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
                Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Shares
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                TOTAL
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.symbol}>
                <TableCell align="center">{holding.symbol}</TableCell>
                <TableCell align="center">{holding.name}</TableCell>
                <TableCell align="center">{holding.shares}</TableCell>
                <TableCell align="center">
                  {holding.price ? `$${holding.price.toLocaleString()}` : ""}
                </TableCell>
                <TableCell align="center">
                  ${holding.total.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="center" colSpan={4}></TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                ${total.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Disclaimer />
    </Container>
  );
}
