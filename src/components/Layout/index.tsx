import {FC, ReactNode} from "react";
import Header from "../Header";
import {CssBaseline} from "@material-ui/core";

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