import { FC, ReactNode } from "react";
import Header from "../Header";
import { CssBaseline } from "@mui/material";

interface ILayoutProps {
  children: ReactNode;
}

const Layout: FC<ILayoutProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
