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
import { useState } from "react";
import { buy } from "../utils/helpers";
import Disclaimer from "../components/Disclaimer";

export default function Buy() {
  const [user, loading] = useAuthState(firebase.auth());
  const router = useRouter();

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState(null);

  if (!loading && !user) {
    router.push("/");
    return <></>;
  }

  const handleSymbolChange = (event) => setSymbol(event.target.value);
  const handleQuantityChange = (event) =>
    setQuantity(
      Number(event.target.value) < 0 ? 0 : Number(event.target.value)
    );

  const buySymbol = () => {
    if (symbol.trim() !== "" && quantity > 0) {
      buy(symbol, quantity, user.uid).then((res) => setMessage(res));
    }
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
        {message ? (
          <>
            <Typography variant="h5">{message}</Typography>
          </>
        ) : (
          <>
            <TextField
              id="outlined-name"
              label="Symbol"
              value={symbol}
              onChange={handleSymbolChange}
            />
            <TextField
              id="outlined-name"
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              type="number"
              sx={{ mt: 2 }}
            />
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
              size="large"
              onClick={buySymbol}
            >
              Buy
            </Button>
          </>
        )}
        <Disclaimer />
      </Grid>
    </Container>
  );
}
