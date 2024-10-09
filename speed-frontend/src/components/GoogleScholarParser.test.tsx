import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoogleScholarParser from "./GoogleScholarParser";
import { Article } from "@/types";

// Mock the article data
const mockArticle: Article = {
  id: "1",
  uid: "12345",
  title: "Sample Article",
  authors: "John Doe",
  journalName: "Sample Journal",
  yearOfPub: new Date("2021"),
  vol: "1",
  pages: "100",
  doi: "10.1234/5678",
  SEP: "Sample SEP",
  claim: "Sample Claim",
  result: "Sample Result",
  submitterUid: "12345",
  status: "NEW",
};

describe("GoogleScholarParser component", () => {
  test("passes the data from article object to search URL", () => {
    render(<GoogleScholarParser article={mockArticle} />);

    // Find the search button
    const searchButton = screen.getByRole("link", {
      name: /Search Google Scholar for this article/i,
    });

    // Check if the correct href attribute is present
    expect(searchButton).toHaveAttribute(
      "href",
      "https://scholar.google.com/scholar?q=Sample%20Article%20John%20Doe%20Sample%20Journal%202021"
    );
    expect(searchButton).toHaveAttribute("target", "_blank");
    expect(searchButton).toHaveAttribute("rel", "noreferrer");
  });
});
