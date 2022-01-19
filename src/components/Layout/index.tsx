import {FC, ReactNode} from "react";
import Header from "../Header";
import {CssBaseline} from "@mui/material";

interface LayoutProps {
    children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <CssBaseline />
            <Header/>
            <main>
                {children}
            </main>
        </>
    )
}

export default Layout