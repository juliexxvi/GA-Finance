import {
  CircularProgress,
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import Header from "../components/Header";
import { useRouter } from "next/router";
import Disclaimer from "../components/Disclaimer";
import { useEffect, useState } from "react";
import { getHoldings, sell } from "../utils/helpers";

export default function Sell() {
  const [user, loading] = useAuthState(firebase.auth());
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [symbol, setSymbol] = useState();
  const [symbolQuantity, setSymbolQuantity] = useState();
  const [holdings, setHoldings] = useState();

  useEffect(() => {
    if (user && !loading) {
      getHoldings(user.uid).then((data) => {
        const keys = Object.keys(data);
        if (keys.length > 0) {
          const firstSymbol = keys[0];
          setSymbol(firstSymbol);
          setSymbolQuantity(data[firstSymbol]);
          setHoldings(data);
        } else {
          setMessage("There is nothing to sell!");
        }
      });
    }
  }, [user]);

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
    setSymbolQuantity(holdings[event.target.value]);
    setQuantity(0);
  };

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= symbolQuantity) {
      setQuantity(value);
    }
  };

  const sellSymbol = () => {
    if (symbol.trim() !== "" && quantity > 0) {
      sell(symbol, quantity, user.uid).then((res) => setMessage(res));
    }
  };

  if (!loading && !user) {
    router.push("/");
    return <></>;
  }

  if (loading || (!holdings && !message)) {
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
              id="outlined-select-symbol"
              label="Symbol"
              select
              value={symbol}
              onChange={handleSymbolChange}
            >
              {Object.keys(holdings).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
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
              onClick={sellSymbol}
            >
              Sell
            </Button>
          </>
        )}
        <Disclaimer />
      </Grid>
    </Container>
  );
}
