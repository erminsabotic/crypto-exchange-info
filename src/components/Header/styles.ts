import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    link: {
        padding: theme.spacing(3, 1),
        color: theme.palette.info.light,
        textDecoration: "none"
    },
    linkContainer: {
        padding: theme.spacing(0, 0, 0, 5)
    }
}))

export default useStyles