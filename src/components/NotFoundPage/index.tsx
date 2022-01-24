import { FC } from "react";
import Layout from "../Layout";
import { Typography } from "@mui/material";

/**
 * 404 page
 */
const NotFoundPage: FC = () => {
  return (
    <Layout>
      <Typography sx={{ pt: 8 }} variant="h1" align="center">
        404 - Not Found
      </Typography>
    </Layout>
  );
};

export default NotFoundPage;
