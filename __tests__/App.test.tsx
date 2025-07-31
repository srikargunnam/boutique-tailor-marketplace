import { render } from "@testing-library/react-native";
import React from "react";
import App from "../App";

// Mock the navigation and store dependencies
jest.mock("@react-navigation/native", () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    children,
}));

jest.mock("@react-navigation/stack", () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

jest.mock("../services/store", () => ({
  useAppStore: () => ({
    user: null,
    setUser: jest.fn(),
    setLoading: jest.fn(),
  }),
}));

jest.mock("../services/auth", () => ({
  AuthService: {
    getCurrentUser: jest.fn(),
  },
}));

describe("App", () => {
  it("renders without crashing", () => {
    const { getByText } = render(<App />);
    // The app should render without throwing any errors
    expect(getByText).toBeDefined();
  });
});
