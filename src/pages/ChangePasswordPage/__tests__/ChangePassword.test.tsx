import { render, screen } from "@testing-library/react"
import ChangePassword from "../ChangePassword"


describe("ChangePassword Component" ,() => {
    test("Rendering ChangePassword", () => {
        render(
            <ChangePassword/>
        )
        expect(screen.getByText("Change Password")).toBeInTheDocument();
        expect(screen.getByLabelText("New Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /toggle password visibility/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Change Password" })).toBeInTheDocument();
    })
})
