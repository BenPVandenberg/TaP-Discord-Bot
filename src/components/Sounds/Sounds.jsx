import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import Table from 'react-bootstrap/Table';
import FileUpload from '../FileUpload';

function Sounds() {
    const [allSounds, setAllSounds] = useState([]);

    const updateSounds = async () => {
        let newAllSounds = [];
        let sounds;
        let soundData;

        // get /play statistics
        await axios.get('http://52.152.174.99:5000/data/play').then(res => {
            soundData = res.data;
        }).catch(err => {
            swal.fire({
                title: 'Error with the server: GET /data/play',
                text: err.response.data.msg || `HTTP Code ${err.response.status}`,
                icon: 'error',
            });
        });

        // get all available sounds
        await axios.get('http://52.152.174.99:5000/sounds').then(res => {
            sounds = res.data;
        }).catch(err => {
            swal.fire({
                title: 'Error with the server: GET /sounds',
                text: err.response.data.msg || `HTTP Code ${err.response.status}`,
                icon: 'error',
            });
        });

        try {
            // if we have data for a song then update allSounds
            sounds.forEach(sound => {
                sound = sound.slice(0,-4);
                newAllSounds.push([soundData[sound] || 0, sound]);
            });

            // sort by highest frequency
            newAllSounds.sort((a, b) => b[0] - a[0]);

            // console.log(newAllSounds);
            setAllSounds(newAllSounds);

        } catch (err) {
            // main errors are handled elsewhere
        }
    };

    // run on mount
    useEffect(() => {
        updateSounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // * This empty array makes useEffect act like componentDidMount

    return (
        <div className="App">
            <h1 className="page-header">
                <p>Sounds</p>
            </h1>
            <Table className="text-white w-25" size="sm" bordered>
                <thead>
                    <tr>
                        <th style={{width: '100px'}}># of plays</th>
                        <th>Name</th>
                    </tr>
                </thead>
                { allSounds.map(function(sound, i){
                    return (
                        <thead key={i}>
                            <tr>
                                <td>{sound[0]}</td>
                                <td>{sound[1]}</td>
                            </tr>
                        </thead>
                    );
                }) }

            </Table>
            <FileUpload />
        </div>
    );
}

export default Sounds;
