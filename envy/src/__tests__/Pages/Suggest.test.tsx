import { render } from "@testing-library/react";
import Suggest from "../../Pages/Suggest";

describe("<Suggest />", () => {
    test("renders without crashing", () => {
        render(<Suggest />);
    });

    test("page components present", () => {
        const { getByRole } = render(<Suggest />);

        const header = getByRole("heading", {
            name: /suggestion page/i,
        });
        const button = getByRole("button", {
            name: /issue\/suggestion submission/i,
        });

        expect(header).toBeTruthy();
        expect(button).toBeTruthy();
    });
});
