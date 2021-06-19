import { render, fireEvent, screen } from "@testing-library/react";
import Data from "../../Pages/Data";
import { Provider } from "react-redux";
import store from "../../store";

describe("<Data />", () => {
    test("renders without crashing", () => {
        render(
            <Provider store={store}>
                <Data />
            </Provider>,
        );
    });
    test("welcome header present", () => {
        const { getByRole } = render(
            <Provider store={store}>
                <Data />
            </Provider>,
        );
        const dataHeader = getByRole("heading", {
            name: /data lookup/i,
        });

        // screen.logTestingPlaygroundURL();
        expect(dataHeader).toBeTruthy();
    });

    // TODO: add tests for text input
});
