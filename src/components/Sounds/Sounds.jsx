import React from 'react';
import axios from 'axios';
import FileUpload from "../FileUpload"

function Sounds() {
    const getSounds = () => {
        let sounds = axios.get('/sounds')
    }

    return (
        <div className="App">
            <header className="App-header">
                <p>Sounds</p>
            </header>
            <FileUpload />
        </div>
    );
}

export default Sounds;
