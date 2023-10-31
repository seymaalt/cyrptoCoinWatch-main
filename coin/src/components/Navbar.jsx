import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "../assets/Logo.png";
import LoginModal from "./LoginModal.jsx";
import RegisterModel from "./RegisterModal.jsx";

export default function SearchAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: "flex" }}
          >
            <img src={Logo} style={{ width: "240px", height: "70px" }}></img>
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="primary">
              <LoginModal />
            </Button>

            <Button color="primary">
              <RegisterModel />
            </Button>

          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
