import { render } from "@testing-library/react"
import { ToastContainer } from "react-toastify"

describe("Rendering", () => {
    test("Initial", () => {
        console.log('INSIDE JEST')
        render(<ToastContainer />)    })
})