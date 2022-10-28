import { Grid, Typography, Link } from "@mui/material";

export default function Disclaimer() {
  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ mt: 6 }}>
      <Typography variant="subtitle2">
        Data provided for free by <Link href="https://iexcloud.io/">IEX</Link>.
        View <Link href="https://iexcloud.io/terms/">IEX's Terms of Use</Link>.
      </Typography>
    </Grid>
  );
}
