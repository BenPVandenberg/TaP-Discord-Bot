import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../../Pages/Login";
import store from "../../store";

describe("<Login />", () => {
    test("renders without crashing", () => {
        render(
            <Provider store={store}>
                <Router>
                    <Login />
                </Router>
            </Provider>
        );
    });

    test("error when no tokens provided", () => {
        const { getByRole } = render(
            <Provider store={store}>
                <Router>
                    <Login />
                </Router>
            </Provider>
        );

        const errorText = getByRole("heading", {
            name: /something went wrong/i,
        });
        expect(errorText).toBeTruthy();
    });
});
