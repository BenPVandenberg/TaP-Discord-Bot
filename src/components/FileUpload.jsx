import React, { Fragment, useState } from 'react'
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');
    
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
            const res = await axios.post('/sounds/upload', formData, { 
                headers: { 'Content-Type': 'multipart/form-data'}
            });

            const { name } = res.data;

            setUploadedFile(`${name} Uploaded!`)

        } catch (e) {
            // print error to console for now
            if (e.response.data) {
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
                    <input type="file" className="form-file-input" id="customFile" onChange={onChange}/>
                </div>
                <input type="submit" value="Upload"/>
            </form>
            <p>{ uploadedFile }</p>
        </Fragment>
    )
}

export default FileUpload
