import {
  CircularProgress,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { lookup } from "../utils/helpers";
import Disclaimer from "../components/Disclaimer";

export default function Quote() {
  const [user, loading] = useAuthState(firebase.auth());
  const router = useRouter();

  if (!loading && !user) {
    router.push("/");
    return <></>;
  }

  const [symbol, setSymbol] = useState("");
  const [symbolData, setSymbolData] = useState(null);

  const handleChange = (event) => setSymbol(event.target.value);
  const getData = () => {
    lookup(symbol).then((data) => setSymbolData(data));
  };

  if (loading) {
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
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 6 }}
      >
        {symbolData ? (
          <>
            <Typography variant="h5">
              A share of {symbolData.name} ({symbolData.symbol}) costs $
              {symbolData.price}
            </Typography>
          </>
        ) : (
          <>
            <TextField
              id="outlined-name"
              label="Symbol"
              value={symbol}
              onChange={handleChange}
            />
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
              size="large"
              onClick={getData}
            >
              Quote
            </Button>
          </>
        )}
        <Disclaimer />
      </Grid>
    </Container>
  );
}
