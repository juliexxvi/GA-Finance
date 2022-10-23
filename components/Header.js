import { Typography, Button, Grid } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";

export default function Header() {
  const [user] = useAuthState(firebase.auth());

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{ mt: 2 }}
    >
      <Grid item>
        <Typography variant="h4" component="h4" gutterBottom>
          GA Finance
        </Typography>
      </Grid>
      <Grid item>
        <Grid item>
          <Typography variant="body2">{user.email}</Typography>
        </Grid>
        <Grid item>
          <Button
            //   href={docs}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
          >
            Log Out
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
