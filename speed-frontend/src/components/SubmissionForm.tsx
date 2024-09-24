import { Article } from "@/types";
import { TextField, Button, Divider } from "@mui/material";
import { useEffect, useState } from "react";

interface SubmissionFormProps {
  article?: Article;
}

export default function SubmissionForm({ article }: SubmissionFormProps) {
  const [formData, setFormData] = useState<Article>({
    id: "",
    uid: "",
    title: "",
    authors: "",
    journalName: "",
    yearOfPub: 0,
    vol: 0,
    pages: 0,
    doi: "",
    SEP: "",
    claim: "",
    result: "",
  });

  // Populate the form with the article data if it exists
  useEffect(() => {
    if (article) {
      setFormData(article);
    }
  }, [article]);

  // Handle form input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(
        article
          ? `${process.env.NEXT_PUBLIC_API_URL}/articles/${article.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        {
          method: article ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        console.log("Article submitted successfully");
      } else {
        console.error("Failed to submit article");
      }
    } catch (error) {
      console.error("Failed to submit article", error);
    }
  };

  return (
    <div>
      <h1>{article ? "Edit Article" : "Submission Form"}</h1>
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
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          id="authors"
          name="authors"
          label="Authors"
          variant="outlined"
          required
          value={formData.authors}
          onChange={handleChange}
        />
        <TextField
          id="journalName"
          name="journalName"
          label="Journal Name"
          variant="outlined"
          required
          value={formData.journalName}
          onChange={handleChange}
        />
        <TextField
          id="yearOfPub"
          name="yearOfPub"
          label="Year of Publication"
          type="number"
          variant="outlined"
          required
          value={formData.yearOfPub}
          onChange={handleChange}
        />
        <TextField
          id="vol"
          name="vol"
          label="Volume Number"
          type="number"
          variant="outlined"
          value={formData.vol}
          onChange={handleChange}
        />
        <TextField
          id="pages"
          name="pages"
          label="Pages"
          type="number"
          variant="outlined"
          value={formData.pages}
          onChange={handleChange}
        />
        <TextField
          id="doi"
          name="doi"
          label="DOI"
          variant="outlined"
          value={formData.doi}
          onChange={handleChange}
        />
        <Divider />
        <TextField
          id="SEP"
          name="SEP"
          label="Software Engineering Practice"
          variant="outlined"
          value={formData.SEP}
          onChange={handleChange}
        />
        <TextField
          id="claim"
          name="claim"
          label="Claim"
          variant="outlined"
          value={formData.claim}
          onChange={handleChange}
        />
        <TextField
          id="result"
          name="result"
          label="Evidence Result"
          variant="outlined"
          value={formData.result}
          onChange={handleChange}
        />
        <Divider />
        <Button variant="contained" type="submit">
          {article ? "Update Article" : "Submit Article"}
        </Button>
      </form>
    </div>
  );
}
