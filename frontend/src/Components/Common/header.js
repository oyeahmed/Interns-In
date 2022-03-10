import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";

export default function Generalheader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Link to={"/"} style={{ color: "white", textDecoration: "none" }}>
            <Typography style={{ fontSize: "30px" }}>Interns-In</Typography>
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          {/* <Link
            to="/CompanySignIn"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Button color="inherit">Sign in as Company</Button>
          </Link> */}
          <Link to="/Signin" style={{ color: "white", textDecoration: "none" }}>
            <Button color="inherit">Sign in</Button>
          </Link>
          <Link to="/SignUp" style={{ color: "white", textDecoration: "none" }}>
            <Button color="inherit">Sign Up</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
