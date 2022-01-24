import { Grid, Link, List, ListItem, Typography } from "@mui/material";
import { FC } from "react";
import Layout from "../Layout";

/**
 * Small homepage component used to help the user navigate around the website
 */
const Homepage: FC = () => {
  return (
    <Layout>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item sx={{ py: { xs: 4, md: 8 } }}>
          {" "}
          <Typography variant="h1">Hi!</Typography>
        </Grid>
        <Grid item sx={{ py: { xs: 2, md: 4 } }}>
          {" "}
          <Typography variant="h2" textAlign="center">
            Welcome to the crypto exchange info
          </Typography>
        </Grid>
        <Grid item>
          {" "}
          <Typography variant="h5" textAlign="center">
            In order to access order book information you can clik on the menu
            item in the navbar, or refer to some of the links below
          </Typography>
        </Grid>
        <Grid item>
          <List dense>
            <ListItem>
              <Link href={"/order-book/BTC_USDT"}>
                {" "}
                To see BTC/USDT order book
              </Link>
            </ListItem>
            <ListItem>
              <Link href={"/order-book/BTC_ETH"}>
                {" "}
                To see BTC/ETH order book
              </Link>
            </ListItem>
            <ListItem>
              <Link href={"/order-book/ADA_USDT"}>
                {" "}
                To see ADA/USDT order book
              </Link>
            </ListItem>
          </List>
        </Grid>
        <Grid item sx={{ py: { xs: 2, md: 4 } }}>
          <Typography textAlign="center">
            This webpage was built by{" "}
            <Link target="_blank" href={"https://github.com/erminsabotic"}>
              @me
            </Link>
            . You can see the repo{" "}
            <Link
              target="_blank"
              href={"https://github.com/erminsabotic/crypto-exchange-info"}
            >
              @here
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Homepage;
