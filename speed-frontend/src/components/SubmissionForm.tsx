import { Article } from "@/types";
import { TextField, Button, Divider, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";

interface SubmissionFormProps {
  article?: string;
}

export default function SubmissionForm({ article }: SubmissionFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<Article>({
    id: "",
    uid: "",
    title: "",
    authors: "",
    journalName: "",
    yearOfPub: 0,
    vol: "",
    pages: "",
    doi: "",
    SEP: "",
    claim: "",
    result: "",
    submitterUid: "",
    status: "",
  });

  // function to fetch article data
  const fetchArticle = async (uid: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/id/${uid}`
      );
      if (response.ok) {
        const data = await response.json();
        data.yearOfPub = new Date(data.yearOfPub).getFullYear();
        setFormData(data as Article);
      } else {
        console.error("Failed to fetch article data");
      }
    } catch (error) {
      console.error("Failed to fetch article data", error);
    }
  };

  // Populate the form with the article data if it exists
  useEffect(() => {
    if (article) {
      if (article === "new") {
        setFormData({
          id: "",
          uid: "",
          title: "",
          authors: "",
          journalName: "",
          yearOfPub: 0,
          vol: "",
          pages: "",
          doi: "",
          SEP: "",
          claim: "",
          result: "",
          submitterUid: "",
          status: "",
        });
        return;
      }
      fetchArticle(article);
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
    if (!user) {
      console.error("User not logged in");
      return;
    }
    setFormData({
      ...formData,
      submitterUid: user.uid,
    });
    try {
      const response = await fetch(
        article
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/id/${formData.uid}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`,
        {
          method: article !== "new" ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        console.log("Article submitted successfully");
        router.push("/submission-success");
      } else {
        console.error("Failed to submit article");
      }
    } catch (error) {
      console.error("Failed to submit article", error);
    }
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <h1>{article !== "new" ? "Edit Submission" : "Submission Form"}</h1>
      {!user ? (
        <p>Please log in to submit an article</p>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            maxWidth: "800px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <TextField
            id="title"
            name="title"
            label="Submission Title"
            variant="outlined"
            required
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="authors"
            name="authors"
            label="Authors"
            variant="outlined"
            required
            fullWidth
            value={formData.authors}
            onChange={handleChange}
          />
          <TextField
            id="journalName"
            name="journalName"
            label="Journal Name"
            variant="outlined"
            required
            fullWidth
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
            fullWidth
            value={formData.yearOfPub}
            onChange={handleChange}
          />
          <TextField
            id="vol"
            name="vol"
            label="Volume Number"
            variant="outlined"
            fullWidth
            value={formData.vol}
            onChange={handleChange}
          />
          <TextField
            id="pages"
            name="pages"
            label="Pages"
            fullWidth
            variant="outlined"
            value={formData.pages}
            onChange={handleChange}
          />
          <TextField
            id="doi"
            name="doi"
            label="DOI"
            fullWidth
            variant="outlined"
            value={formData.doi}
            onChange={handleChange}
          />
          <Divider />
          <TextField
            id="SEP"
            name="SEP"
            label="Software Engineering Practice"
            fullWidth
            variant="outlined"
            value={formData.SEP}
            onChange={handleChange}
          />
          <TextField
            id="claim"
            name="claim"
            label="Claim"
            fullWidth
            variant="outlined"
            value={formData.claim}
            onChange={handleChange}
          />
          <TextField
            id="result"
            name="result"
            label="Evidence Result"
            fullWidth
            variant="outlined"
            value={formData.result}
            onChange={handleChange}
          />
          <Divider />
          <Button variant="contained" type="submit">
            {article !== "new" ? "Update Submission" : "Submit Article"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
