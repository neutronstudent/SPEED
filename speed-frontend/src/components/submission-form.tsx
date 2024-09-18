import { TextField, Button, Divider } from "@mui/material";

export default function SubmissionForm() {
  return (
    <div>
      <h1>Submission Form</h1>
      <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextField id="submission-title" label="Submission Title" variant="outlined" required={true} />
        <TextField id="authors" label="Authors" variant="outlined" required={true} />
        <TextField id="journal-name" label="Journal Name" variant="outlined" required={true}/>
        <TextField
          id="publication-year"
          label="Year of Publication"
          type="number"
          variant="outlined"
          required={true}
        />
        <TextField id="volume" label="Volume Number" type="number" variant="outlined" />
        <TextField id="pages" label="Pages" type="number" variant="outlined" />
        <TextField id="doi" label="DOI" variant="outlined" />
        <Divider />
        <TextField
          id="se-practice"
          label="Software Engineering Practice"
          variant="outlined"
        />
        <TextField id="claim" label="Claim" variant="outlined" />
        <TextField
          id="evidence-result"
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
