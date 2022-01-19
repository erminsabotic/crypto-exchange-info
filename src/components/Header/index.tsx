import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {AppBar, Container, Toolbar, Typography} from "@mui/material";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
    return (
        <>
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6">Welcome</Typography>
                    <Container sx={{ padding: "0 0 0 5px" }}>
                        <Link to="">Homepage</Link>
                        <Link to="/order-book">Order book</Link>
                    </Container>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header