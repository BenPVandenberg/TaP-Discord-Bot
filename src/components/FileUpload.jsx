import React, { Fragment, useState } from 'react'
import axios from 'axios';
import swal from 'sweetalert2'

function FileUpload() {
    const [file, setFile] = useState('');
    
    const onChange = e => {
        setFile(e.target.files[0])
    }

    const onSubmit = async e => {
        e.preventDefault();
        // create form data
        const formData = new FormData();
        formData.append('file', file);

        // try post request
        try {
            axios.post('/sounds/upload', formData, { 
                headers: { 'Content-Type': 'multipart/form-data'}

            }).then((res) => {
                // notify user of success
                swal.fire({
                    title: `${res.data.name} was uploaded!`,
                    icon: "success",
                }).then(() => {
                    // refresh list to show new sound
                    window.location = '/sounds/';
                });

                // reset file value (no longer needed with the refresh)
                // setFile('');

            }).catch(err => {
                // notify user of issue uploading
                if (err.response) {
                    swal.fire({
                        title: "Error with the server",
                        text: err.response.data.msg || `HTTP Response: ${err.response.status}`,
                        icon: "error",
                    });
                }
            });

        } catch (e) {
            // print error to console for now
            if (e.response) {
                console.warn(e.response.data.msg)
            } else {
                console.warn('There was a problem with the upload server')
            }
        }
    }

    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                <div className="form-custom-file">
                    <input type="file" className="form-file-input" id="customFile" accept=".mp3" onChange={onChange}/>
                </div>
                <input type="submit" value="Upload"/>
            </form>
        </Fragment>
    )
}

export default FileUpload
