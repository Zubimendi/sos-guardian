import React from "react";
import {render} from "@testing-library/react-native";
import LoginScreen from "../src/screens/auth/LoginScreen";

describe("LoginScreen", () => {
  it("renders app title", () => {
    const {getByText} = render(
      <LoginScreen navigation={{navigate: jest.fn()}} as any />,
    );

    expect(getByText("SOS Guardian")).toBeTruthy();
  });
});

