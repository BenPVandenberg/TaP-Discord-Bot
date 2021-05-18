import React from "react";
import { render, screen, within } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Home from "../../Pages/Home";

describe("<Home />", () => {
    test("renders without crashing", () => {
        render(
            <Router>
                <Home />
            </Router>,
        );
    });

    test("welcome header present", () => {
        const { getByText } = render(
            <Router>
                <Home />
            </Router>,
        );
        const homeHeader = getByText("Home");

        expect(homeHeader).toBeTruthy();
    });
});
