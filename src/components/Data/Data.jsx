import axios from 'axios';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Swal from 'sweetalert2';
import './Data.css';
import ReactJson from 'react-json-view';



export default class Data extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userID: '', // Text input value
            allGameData: {}, // all game data from backend
            gameData: {}, // user specific game data from allGameData
        };
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.getDataJSON(this.state.userID);
    }

    getDataJSON = async (userID) => {
        if (!Object.keys(this.state.allGameData).length) {
            await this.updateAllData();
        }

        const allGameData = this.state.allGameData;

        // check if user is in rawData
        if (!allGameData[userID]) {
            // TODO Make it also possible to search by user name

            Swal.fire({
                title: 'Invalid User ID',
                text: 'This user doesn\'t exist or isn\'t in T&P',
                icon: 'warning'
            });
            return;
        }

        this.setState({ gameData: allGameData[userID] });
    }

    updateAllData= async () => {
        await axios.get('http://52.152.174.99:5000/data/game').then((res) => {
            this.setState({ allGameData: res.data });
            return true;

        }).catch((err) => {
            Swal.fire({
                title: 'Error with the server: GET /data/game',
                text: err.response.data.msg || `HTTP Code ${err.response.status}`,
                icon: 'error'
            });

            return false;
        });
    }

    render() {
        let gameDataView;

        // if we have game data, display it
        if (Object.keys(this.state.gameData).length) {
            gameDataView = <ReactJson src={this.state.gameData} theme="twilight" name={this.state.userID} collapsed={ 2 } style={{background:  'rgb(18, 20, 24)'}}/>;
        }

        return (
            <div className="App">
                <h1 className="page-header">
                    <p>Data</p>
                </h1>

                {/* Get User ID to look for */}
                <Form onSubmit={this.onSubmit}>
                    <Form.Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Label htmlFor="inlineFormInputGroup" srOnly>
                                User ID
                            </Form.Label>
                            <InputGroup className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>@</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    type="text"
                                    placeholder="User ID"
                                    value={this.state.userID}
                                    onChange={e => this.setState({ userID: e.target.value })}
                                />
                            </InputGroup>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit" className="mb-2">
                                Search
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>

                {/* Render game data if we have it */}
                {gameDataView}

            </div>
        );
    }
}
