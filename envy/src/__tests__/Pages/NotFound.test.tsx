import { render, screen } from "@testing-library/react";
import NotFound from "../../Pages/NotFound";

describe("<NotFound />", () => {
    test("renders without crashing", () => {
        render(<NotFound />);
    });

    test("404 not found header present", () => {
        const { getByRole } = render(<NotFound />);
        const header = getByRole("heading", {
            name: /404 not found/i,
        });

        expect(header).toBeTruthy();
    });
});
