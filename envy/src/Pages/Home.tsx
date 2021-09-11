import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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

export default function Home() {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <h1>Home</h1>
            <p>
                Welcome to the official T&P site. This is where you can preform
                a few actions such as looking at play and game data, make
                bot/website suggestions, and upload your own sound clips!
            </p>
            <p>
                Please report bugs on the project's{" "}
                <Link to="/suggest">Github</Link>.
            </p>
        </div>
    );
}
