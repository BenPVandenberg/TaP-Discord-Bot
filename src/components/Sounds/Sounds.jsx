import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import FileUpload from '../FileUpload';
import SoundTable from './SoundTable';

function Sounds() {
    const [allSounds, setAllSounds] = useState([]);

    const updateSounds = async () => {
        const newAllSounds = [];
        let sounds;
        let soundData;

        // get /play statistics
        await axios
            .get('http://localhost:5000/data/play')
            .then((res) => {
                soundData = res.data;
                console.log(soundData);
            })
            .catch((err) => {
                Swal.fire({
                    title: 'Error with the server: GET /data/play',
                    text:
                        err.response.data.msg ||
                        `HTTP Code ${err.response.status}`,
                    icon: 'error',
                });
            });

        // get all available sounds
        await axios
            .get('http://52.152.174.99:5000/sounds')
            .then((res) => {
                sounds = res.data;
            })
            .catch((err) => {
                Swal.fire({
                    title: 'Error with the server: GET /sounds',
                    text:
                        err.response.data.msg ||
                        `HTTP Code ${err.response.status}`,
                    icon: 'error',
                });
            });

        try {
            // if we have data for a song then update allSounds
            sounds.forEach((sound) => {
                sound = sound.slice(0, -4);
                // newAllSounds.push([soundData[sound] || 0, sound]);
                newAllSounds.push(
                    {
                        name: sound,
                        occurrences: soundData[sound]['occurrences'] || 0,
                        ownerID: soundData[sound]['ownerID'] || null,
                        ownerName: soundData[sound]['ownerName'] || ''
                    });
            });

            // sort by highest frequencyFF
            newAllSounds.sort((a, b) => b.occurrences - a.occurrences);

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
            <SoundTable sounds={allSounds} />
            <FileUpload />
        </div>
    );
}

export default Sounds;
