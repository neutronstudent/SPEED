import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SubmissionForm from "./SubmissionForm";
import { Article } from "@/types";

// Mock the fetch function
const mockArticle: Article = {
  id: "1",
  uid: "12345",
  title: "Sample Article",
  authors: "John Doe",
  journalName: "Sample Journal",
  yearOfPub: 2021,
  vol: "1",
  pages: "100",
  doi: "10.1234/5678",
  SEP: "Sample SEP",
  claim: "Sample Claim",
  result: "Sample Result",
  submitterUid: "12345",
  status: "NEW"
};

// Mock the firebase user with the uid "12345"
jest.mock("./UserContext", () => ({
  useUser: () => ({
    user: {
      uid: "12345",
    },
  }),
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockArticle),
    ok: true,
  })
) as jest.Mock;

describe("SubmissionForm component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the form with empty fields for creating a new article", () => {
    render(<SubmissionForm />);

    // Check if the form is rendered with empty fields
    expect(screen.getByLabelText(/Submission Title/i)).toHaveValue("");
    expect(screen.getByLabelText(/Authors/i)).toHaveValue("");
    expect(screen.getByLabelText(/Journal Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Year of Publication/i)).toHaveValue(0);
    expect(screen.getByLabelText(/Volume/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Pages/i)).toHaveValue(null);
    expect(screen.getByLabelText(/DOI/i)).toHaveValue("");
    expect(screen.getByLabelText(/Software Engineering Practice/i)).toHaveValue(
      ""
    );
    expect(screen.getByLabelText(/Claim/i)).toHaveValue("");
    expect(screen.getByLabelText(/Result/i)).toHaveValue("");
  });
  
  test("renders the form with pre-filled data for editing an article", () => {
    render(<SubmissionForm article={mockArticle} />);

    // Check if the form is rendered with the correct initial values
    expect(screen.getByDisplayValue("Sample Article")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sample Journal")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2021")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10.1234/5678")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sample SEP")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sample Claim")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sample Result")).toBeInTheDocument();
  });

  test("handles form input changes correctly", () => {
    render(<SubmissionForm />);
    const titleInput = screen.getByLabelText(/Submission Title/i);
    const authorsInput = screen.getByLabelText(/Authors/i);
    const journalNameInput = screen.getByLabelText(/Journal Name/i);
    const yearOfPubInput = screen.getByLabelText(/Year of Publication/i);
    const volInput = screen.getByLabelText(/Volume/i);
    const pagesInput = screen.getByLabelText(/Pages/i);
    const doiInput = screen.getByLabelText(/DOI/i);
    const SEPInput = screen.getByLabelText(/Software Engineering Practice/i);
    const claimInput = screen.getByLabelText(/Claim/i);
    const resultInput = screen.getByLabelText(/Result/i);

    // Change the input values
    fireEvent.change(titleInput, { target: { value: "New Article" } });
    fireEvent.change(authorsInput, { target: { value: "Jane Doe" } });
    fireEvent.change(journalNameInput, { target: { value: "New Journal" } });
    fireEvent.change(yearOfPubInput, { target: { value: 2022 } });
    fireEvent.change(volInput, { target: { value: 2 } });
    fireEvent.change(pagesInput, { target: { value: 200 } });
    fireEvent.change(doiInput, { target: { value: "10.9876/5432" } });
    fireEvent.change(SEPInput, { target: { value: "New SEP" } });
    fireEvent.change(claimInput, { target: { value: "New Claim" } });
    fireEvent.change(resultInput, { target: { value: "New Result" } });

    // Check if the input values are updated correctly
    expect(titleInput).toHaveValue("New Article");
    expect(authorsInput).toHaveValue("Jane Doe");
    expect(journalNameInput).toHaveValue("New Journal");
    expect(yearOfPubInput).toHaveValue(2022);
    expect(volInput).toHaveValue(2);
    expect(pagesInput).toHaveValue(200);
    expect(doiInput).toHaveValue("10.9876/5432");
    expect(SEPInput).toHaveValue("New SEP");
    expect(claimInput).toHaveValue("New Claim");
    expect(resultInput).toHaveValue("New Result");
  });

  // test("submits the form data correctly", async () => {
  //   render(<SubmissionForm article={mockArticle} />);

  //   // Change form data
  //   fireEvent.change(screen.getByLabelText(/Submission Title/i), {
  //     target: { value: "Updated Article" },
  //   });

  //   // Wait for the form data to update in the DOM
  //   await waitFor(() => {
  //     expect(screen.getByDisplayValue("Updated Article")).toBeInTheDocument();
  //   });

  //   // Submit the form after ensuring the state update is reflected
  //   fireEvent.submit(screen.getByRole("button", { name: "Update Submission" }));

  //   // Wait for the fetch call to complete
  //   await waitFor(() => {
  //     expect(fetch).toHaveBeenCalledWith(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/id/1`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           id: "1",
  //           uid: "12345",
  //           title: "Updated Article",
  //           authors: "John Doe",
  //           journalName: "Sample Journal",
  //           yearOfPub: 2021,
  //           vol: 1,
  //           pages: 100,
  //           doi: "10.1234/5678",
  //           SEP: "Sample SEP",
  //           claim: "Sample Claim",
  //           result: "Sample Result",
  //           submitterUid: "12345",
  //         }),
  //       }
  //     );
  //   });
  // });
});
