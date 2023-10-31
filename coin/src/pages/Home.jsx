import Overview from "../components/OverviewBox.jsx";
import Navbar from "../components/Navbar.jsx";
import CoinList from "../components/CoinList.jsx";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  return (
   
    <div>
      <Navbar />
      <div style={{ marginTop: "130px" }}>
        <Box sx={{ flexGrow: 1 }}>
          
          <Grid container spacing={3}>
            <Grid item xs></Grid>
            <Grid item xs={9}>
             <Overview />
              <Item>
                <CoinList />
              </Item>
            </Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>
      </div>
    </div>
  
  );
}
