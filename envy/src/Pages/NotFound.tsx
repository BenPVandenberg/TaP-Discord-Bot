import { makeStyles } from "@material-ui/core/styles";
import notFoundPicture from "../assets/404_image.png";

const useStyles = makeStyles((theme) => {
    return {
        wrapper: {
            // Following need to be specified to center correctly
            textAlign: "center",
            margin: "auto",
            // end of required values
            width: "75%",
        },
    };
});

export default function NotFound() {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <h1>404 Not Found</h1>
            <img src={notFoundPicture} alt="404 not found meme" />
        </div>
    );
}
