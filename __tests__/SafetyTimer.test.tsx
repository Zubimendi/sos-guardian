import React from "react";
import {render, fireEvent} from "@testing-library/react-native";
import SafetyTimer from "../src/components/emergency/SafetyTimer";

describe("SafetyTimer", () => {
  it("renders preset pills and calls onStart with selected duration", () => {
    const handleStart = jest.fn();
    const {getByText} = render(<SafetyTimer onStart={handleStart} />);

    // default preset should be in the UI
    const thirtyButton = getByText(/30 min/i);
    fireEvent.press(thirtyButton);

    const startButton = getByText(/Start 30 min timer/i);
    fireEvent.press(startButton);

    expect(handleStart).toHaveBeenCalledWith(30);
  });
});

