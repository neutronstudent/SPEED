import { TextField, Button, Divider } from "@mui/material";

export default function SubmissionForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const submissionData = Object.fromEntries(formData.entries());
    // Send submissionData to the backend
    console.table(submissionData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit article");
      } else {
        console.log("Article submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting article:", error);
    }
  };

  return (
    <div>
      <h1>Submission Form</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <TextField
          id="title"
          name="title"
          label="Submission Title"
          variant="outlined"
          required
        />
        <TextField
          id="authors"
          name="authors"
          label="Authors"
          variant="outlined"
          required
        />
        <TextField
          id="journalName"
          name="journalName"
          label="Journal Name"
          variant="outlined"
          required
        />
        <TextField
          id="yearOfPub"
          name="yearOfPub"
          label="Year of Publication"
          type="number"
          variant="outlined"
          required
        />
        <TextField
          id="vol"
          name="vol"
          label="Volume Number"
          type="number"
          variant="outlined"
        />
        <TextField
          id="pages"
          name="pages"
          label="Pages"
          type="number"
          variant="outlined"
        />
        <TextField id="doi" name="doi" label="DOI" variant="outlined" />
        <Divider />
        <TextField
          id="SEP"
          name="SEP"
          label="Software Engineering Practice"
          variant="outlined"
        />
        <TextField id="claim" name="claim" label="Claim" variant="outlined" />
        <TextField
          id="result"
          name="result"
          label="Evidence Result"
          variant="outlined"
        />
        <Divider />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
