import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidenav from "./sidenav";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";
import { login, logout } from "@/controller/login";

// Mocking the next/router module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mocking the UserContext
jest.mock("./UserContext", () => ({
  useUser: jest.fn(),
}));

// Mocking the logout function
jest.mock("../controller/login", () => ({
  logout: jest.fn(),
}));

describe("Sidenav component", () => {
  const mockPush = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useUser as jest.Mock).mockReturnValue({
      user: { email: "test@example.com", role: "User" },
      setUser: mockSetUser,
    });

    mockPush.mockClear();
    mockSetUser.mockClear();
  });

  test("renders the component with the correct initial links", () => {
    render(<Sidenav />);

    // Check if essential navigation items are rendered
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Submit Article")).toBeInTheDocument();
    expect(screen.getByText("My Submissions")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates to correct pages on click", () => {
    render(<Sidenav />);

    // Click on "Home" link
    fireEvent.click(screen.getByText("Home"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");

    // Click on "Submit Article" link
    fireEvent.click(screen.getByText("Submit Article"));
    expect(mockPush).toHaveBeenCalledWith("/submit?uid=new");

    // Click on "My Submissions" link
    fireEvent.click(screen.getByText("My Submissions"));
    expect(mockPush).toHaveBeenCalledWith("/my-submissions");
  });

  test("renders moderation link for Moderator role", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { email: "moderator@example.com", role: "Moderator" },
      setUser: mockSetUser,
    });

    render(<Sidenav />);

    expect(screen.getByText("Moderation")).toBeInTheDocument();

    // Click on "Moderation" link
    fireEvent.click(screen.getByText("Moderation"));
    expect(mockPush).toHaveBeenCalledWith("/moderator-analyst");
  });

  test("renders analysis link for Analyst role", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { email: "analyst@example.com", role: "Analyst" },
      setUser: mockSetUser,
    });

    render(<Sidenav />);

    expect(screen.getByText("Analysis")).toBeInTheDocument();

    // Click on "Analysis" link
    fireEvent.click(screen.getByText("Analysis"));
    expect(mockPush).toHaveBeenCalledWith("/moderator-analyst");
  });

  test("handles logout properly", async () => {
    render(<Sidenav />);

    // Click on "Logout" button
    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      // Expect logout to be called
      expect(logout).toHaveBeenCalled();

      // Expect user to be set to null and redirected to "/"
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
