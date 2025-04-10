import { fireEvent, render, screen } from "@testing-library/react";
import InputField from "../InputField";
import { FormProvider, useForm } from "react-hook-form";
import React from "react";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({
    mode: "onBlur"
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("InputField Component", () => {
  test("Rendering InputField Component", () => {
    render(
      <Wrapper>
        <InputField type="email" name="email" placeholder="Enter email" />
        <InputField type="password" name="password" placeholder="Enter password" />
      </Wrapper>
    );
    screen.debug();
    expect(screen.getByLabelText("Enter   email")).toBeInTheDocument();
    expect(screen.getByLabelText("Enter password")).toBeInTheDocument();
  });
  test("Valid Email Check", () => {
    render(
      <Wrapper>
        <InputField type="email" name="email" placeholder="Enter email" />
      </Wrapper>
    )
    const emailTestInput = screen.getByLabelText("Enter email");
    fireEvent.change(emailTestInput, { target: { value: "santhosh@mailinator.com" } });
    fireEvent.blur(emailTestInput);
    expect(screen.queryByText((msg) => msg.includes("must be valid"))).not.toBeInTheDocument();
  })
  test("Invalid Email Check", async () => {
    render(
      <Wrapper>
        <InputField type="email" name="email" placeholder="Enter email" />
      </Wrapper>
    )
    const emailTestInput = screen.getByLabelText("Enter email");
    fireEvent.change(emailTestInput, { target: { value: "santhoshmailinator.com" } });
    fireEvent.blur(emailTestInput);
    expect(await screen.findByText((msg) => msg.includes("must be valid"))).toBeInTheDocument();
  });
  test("Valid Password Check", () => {
    render(
        <Wrapper>
            <InputField type="password" name="password" placeholder="Enter password" />
        </Wrapper>
    )
    const passwordTestInput = screen.getByLabelText("Enter password");
    fireEvent.change(passwordTestInput, { target: { value: "Admin@123"}});
    fireEvent.blur(passwordTestInput);
    expect(screen.queryByText((msg) => msg.includes("include a uppercase letter, a number, and a special character"))).not.toBeInTheDocument();
  })
  test("Invalid Password Check", async () => {
    render(
        <Wrapper>
            <InputField type="password" name="password" placeholder="Enter password" />
        </Wrapper>
    )
    const passwordTestInput = screen.getByLabelText("Enter password");
    fireEvent.change(passwordTestInput, { target : { value: "santhosh"}});
    fireEvent.blur(passwordTestInput);
    const testPassword = await screen.findByTestId('passwordError');
    expect(testPassword.textContent?.includes("Password is required") || testPassword.textContent?.includes("include a uppercase letter, a number, and a special character")).toBe(true);
})
});
