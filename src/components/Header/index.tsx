import React, { FC } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Link,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { linkStyle } from "./style";
import { dark } from "@mui/material/styles/createPalette";

interface IHeaderProps {}

const Header: FC<IHeaderProps> = () => {
  const navigate = useNavigate();
  return (
    <>
      <AppBar position="relative" color="primary">
        <Toolbar color={"secondary.light"}>
          <Typography variant="h6">Welcome</Typography>
          <Container sx={{ padding: "0 0 0 5px" }}>
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
          </Container>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
