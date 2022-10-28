import { Typography, Button, Grid, Divider } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

const auth = getAuth();

export default function Header() {
  const [user] = useAuthState(firebase.auth());
  const router = useRouter();

  if (!user) {
    return <></>;
  }

  const [userDoc, userDocLoading] = useDocument(
    firebase.firestore().collection("users").doc(user.uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (userDoc && !userDocLoading && userDoc.data()) {
      setBalance(userDoc.data().balance.toLocaleString());
    }
  }, [userDoc]);

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2, mb: 2 }}
      >
        <Grid item xs="auto">
          <Typography
            variant="h4"
            component="h4"
            onClick={() => {
              router.push("/dashboard");
            }}
            style={{ cursor: "pointer" }}
          >
            GA Finance
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ ml: 4 }}>
          <Grid container alignItems="center">
            <Button
              href="/quote"
              sx={{ mr: 2 }}
              variant="text"
              color="primary"
              size="large"
              style={{ minWidth: "80px" }}
            >
              Quote
            </Button>
            <Button
              href="/buy"
              sx={{ mr: 2 }}
              variant="text"
              color="primary"
              size="large"
              style={{ minWidth: "80px" }}
            >
              Buy
            </Button>
            <Button
              href="/sell"
              sx={{ mr: 2 }}
              variant="text"
              color="primary"
              size="large"
              style={{ minWidth: "80px" }}
            >
              Sell
            </Button>
            <Button
              href="/history"
              sx={{ mr: 2 }}
              variant="text"
              color="primary"
              size="large"
              style={{ minWidth: "80px" }}
            >
              History
            </Button>
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
              <Typography variant="body2" sx={{ mr: 2 }}>
                {user.email}
              </Typography>
              {balance && (
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Balance: ${balance}
                </Typography>
              )}
            </Grid>
            <Button
              variant="contained"
              onClick={() => {
                signOut(auth).then(() => router.push("/"));
              }}
            >
              Log Out
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}
