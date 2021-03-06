import { FC, ReactNode } from "react";
import Header from "../Header";
import { CssBaseline } from "@mui/material";

interface ILayoutProps {
  children: ReactNode;
}

/**
 * Layout component for the application
 * Sets up simple layout with header on top and main content below
 *
 * @param children
 */
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
