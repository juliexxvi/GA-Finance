import { CircularProgress, Container, Grid } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import Header from "../components/Header";
import { useRouter } from "next/router";

export default function Buy() {
  const [user, loading] = useAuthState(firebase.auth());
  const router = useRouter();

  if (!loading && !user) {
    router.push("/");
    return <></>;
  }

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
      <Header></Header>
    </Container>
  );
}
