import React, { FC } from "react";
import { AppBar, Toolbar, Typography, Link, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { linkStyle } from "./style";

const Header: FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <AppBar position="relative" color="primary">
        <Toolbar color={"secondary.light"}>
          <Typography variant="h6">Welcome</Typography>
          <Grid container justifyContent={{ xs: "end", md: "start" }}>
            <Grid item>
              <Link
                sx={{ ...linkStyle }}
                component="button"
                variant="body1"
                underline="hover"
                onClick={() => {
                  navigate("/");
                }}
              >
                Homepage
              </Link>
            </Grid>
            <Grid item>
              <Link
                sx={{ ...linkStyle }}
                component="button"
                variant="body1"
                underline="hover"
                onClick={() => {
                  navigate("/order-book/BTC_USDT");
                }}
              >
                Order book
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
