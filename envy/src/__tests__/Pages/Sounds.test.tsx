import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import Sounds from "../../Pages/Sounds";
import store from "../../store";

describe("<Sounds />", () => {
    test("renders without crashing", () => {
        render(
            <Provider store={store}>
                <Sounds />
            </Provider>,
        );
    });

    test("page components present", () => {
        const { getByRole } = render(
            <Provider store={store}>
                <Sounds />
            </Provider>,
        );

        const header = getByRole("heading", {
            name: /sounds/i,
        });
        const table = getByRole("table");
        const h1 = getByRole("columnheader", {
            name: /sound name/i,
        });
        const h2 = getByRole("columnheader", {
            name: /# of plays/i,
        });
        const h3 = getByRole("columnheader", {
            name: /owner/i,
        });

        expect(header).toBeTruthy();
        expect(table).toBeTruthy();
        expect(h1).toBeTruthy();
        expect(h2).toBeTruthy();
        expect(h3).toBeTruthy();
    });
});
