import { render } from "@testing-library/react";
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
        const { getByRole } = render(
            <Router>
                <Home />
            </Router>,
        );
        const homeHeader = getByRole("heading", {
            name: /home/i,
        });

        expect(homeHeader).toBeTruthy();
    });
});
