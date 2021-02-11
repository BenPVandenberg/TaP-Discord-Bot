import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';


const useStyles = makeStyles({
    wrapper: {
        textAlign: 'center'
    },
    input: {
        width: '50%',
        minWidth: '280px',
    },
    idInput: {
        width: '280px'
    }
});

export default function Suggest() {
    const [suggestionText, setSuggestionText] = useState('');
    const [suggestionOwner, setSuggestionOwner] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(suggestionText);
        console.log(suggestionOwner);
    };

    // eslint-disable-next-line no-unused-vars
    const classes = useStyles();

    return (
        <div className={classes.wrapper}>
            <h1>
                <p>Suggestion Page</p>
            </h1>
            <form onSubmit={onSubmit}>
                <div className={useStyles.rowDiv}>
                    <TextField
                        component={Paper}
                        multiline
                        variant="outlined"
                        className={classes.input}
                        placeholder="Suggestion"
                        value={suggestionText}
                        onChange={(event) => setSuggestionText(event.target.value)}
                    />
                </div>
                <div className={useStyles.rowDiv}>
                    <TextField
                        component={Paper}
                        variant="outlined"
                        className={classes.idInput}
                        placeholder="Discord UserID (optional)"
                        value={suggestionOwner}
                        onChange={(event) => setSuggestionOwner(event.target.value)}

                    />
                </div>
                <div className={useStyles.rowDiv}>
                    <Button color="secondary" variant="contained" type="submit">Submit</Button>
                </div>
            </form>
        </div>
    );
}
