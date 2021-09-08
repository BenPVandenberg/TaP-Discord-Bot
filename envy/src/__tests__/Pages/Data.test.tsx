import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import Data from "../../Pages/Data";
import store from "../../store";

describe("<Data />", () => {
    test("renders without crashing", () => {
        render(
            <Provider store={store}>
                <Data />
            </Provider>
        );
    });
    test("welcome header present", () => {
        const { getByRole } = render(
            <Provider store={store}>
                <Data />
            </Provider>
        );
        const dataHeader = getByRole("heading", {
            name: /data lookup/i,
        });

        // screen.logTestingPlaygroundURL();
        expect(dataHeader).toBeTruthy();
    });

    // TODO: add tests for text input
});
