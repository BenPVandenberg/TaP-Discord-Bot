// @ts-nocheck
import axios from "axios";
import React from "react";
import Button from "@material-ui/core/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ReactJson from "react-json-view";
import Swal from "sweetalert2";

export default class Data extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "", // Text input value
            allGameData: [], // all game data from backend
            gameData: [], // user specific game data from allGameData
        };
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.generateUserData(this.state.userID);
    };

    generateUserData = async (userID) => {
        // only need to get all the data once on first search
        if (!this.state.allGameData.length) {
            await this.pullAllData();
        }
        // TODO Make it also possible to search by user name
        // eslint-disable-next-line eqeqeq
        const userData = this.state.allGameData.filter(
            (e) => e.userID == userID,
        );

        // check if user is in rawData
        if (!userData.length) {
            Swal.fire({
                title: "Invalid User ID",
                text: "This user doesn't exist or isn't in T&P",
                icon: "warning",
            });
            return;
        }

        this.setState({ gameData: userData });
    };

    pullAllData = async () => {
        await axios
            .get("http://18.219.56.43:5000/data/game")
            .then((res) => {
                this.setState({ allGameData: res.data });
                return true;
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error with the server: GET /data/game",
                    text:
                        err.response.data.msg ||
                        `HTTP Code ${err.response.status}`,
                    icon: "error",
                });

                return false;
            });
    };

    render() {
        let gameDataView;

        // if we have game data, display it
        if (Object.keys(this.state.gameData).length) {
            gameDataView = (
                <ReactJson
                    src={this.state.gameData}
                    theme="twilight"
                    name={this.state.userID}
                    collapsed={2}
                    style={{ background: "rgb(18, 20, 24)" }}
                />
            );
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
                                    onChange={(e) =>
                                        this.setState({
                                            userID: e.target.value,
                                        })
                                    }
                                />
                            </InputGroup>
                        </Col>
                        <Col xs="auto">
                            <Button
                                color="secondary"
                                type="submit"
                                variant="contained"
                            >
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
