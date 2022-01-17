import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import useStyles from "./styles";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
    const classes = useStyles()
    return (
        <>
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6">Welcome</Typography>
                    <div className={classes.linkContainer}>
                        <Link to="" className={classes.link}>Homepage</Link>
                        <Link to="/order-book" className={classes.link}>Order book</Link>
                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header