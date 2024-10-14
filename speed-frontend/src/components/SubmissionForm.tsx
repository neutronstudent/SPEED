import { Article } from "@/types";
import { TextField, Button, Divider, Box, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";
import DeleteArticle from "./DeletionDialog";

interface SubmissionFormProps {
  article?: string;
}

export default function SubmissionForm({ article }: SubmissionFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState<Article>({
    id: "",
    uid: "",
    title: "",
    authors: "",
    journalName: "",
    yearOfPub: new Date(),
    vol: "",
    pages: "",
    doi: "",
    SEP: "",
    claim: "",
    result: "",
    submitterUid: "",
    status: "",
  });
  const [tempYear, setTempYear] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // function to fetch article data
  const fetchArticle = async (uid: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${uid}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Article data fetched successfully", data);
        // Convert yearOfPub from string to Date object
        setTempYear(new Date(data.yearOfPub).getFullYear().toString());
        setFormData({
          ...data,
          yearOfPub: new Date(data.yearOfPub),
        });
      } else {
        console.error("Failed to fetch article data");
        setError("Article not found");
      }
    } catch (error) {
      console.error("Failed to fetch article data", error);
      setError("Article not found");
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
          yearOfPub: new Date(),
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

  // console logs for date object
  useEffect(() => {
    console.log(tempYear);
  }, [tempYear]);

  // Handle form input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

   // Function to check if the DOI already exists
   const checkDOIExists = async () => {
    if (!formData.doi) return false;
  
    try {
      console.log("Checking DOI:", formData.doi);
      const response = await fetch(`${backendUrl}/api/articles/search-by-doi?doi=${encodeURIComponent(formData.doi)}`);
  
      if (response.status === 404) {
        console.log("No article found for this DOI");
        return null;
      }
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error(`Failed to check DOI: ${response.statusText}`);
      }
  
      const textData = await response.text();
      console.log("Raw response data:", textData);
  
      const data = textData ? JSON.parse(textData) : null;
      console.log("DOI check response:", data);
  
      return data;
    } catch (error) {
      console.error("Error checking DOI:", error);
      setError("Failed to check DOI. Please try again later.");
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    if(tempYear.length !== 4) {
      setError("Year of publication must be 4 digits long");
      return;
    }
    if(tempYear.match(/[^0-9]/)) {
      setError("Year of publication must be a number");
      return;
    }
    if(tempYear < "1700" || tempYear > new Date().getFullYear().toString()) {
      setError("Year of publication must be between 1000 and current year");
      return;
    }

    const existingArticle = await checkDOIExists();
    console.log("Existing Article:", existingArticle);
    if (existingArticle && existingArticle.uid !== formData.uid) {
      let message = "";
      if (existingArticle.status === "APPROVED") {
        message = "An article with this DOI is already approved.";
      } else if (existingArticle.status === "DENIED") {
        message = `This article was rejected for the following reason: ${existingArticle.modNote}`;
      } else {
        message = "An article with this DOI is already in progress.";
      }
      alert(message);
      return; 
    }

    const updatedFormData = {
      ...formData,
      yearOfPub: new Date(tempYear),
      submitterUid: user.uid,
    };

    try {
      const response = await fetch(
        article !== "new"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${formData.uid}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`,
        {
          method: article !== "new" ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (response.ok) {
        console.log("Article submitted successfully");
        // console.log(updatedFormData);
        router.push("/submission-success");
      } else {
        console.error("Failed to submit article");
        setError("Failed to submit article");
      }
    } catch (error) {
      console.error("Failed to submit article", error);
      setError("Failed to submit article");
    }
  };

  // Handle delete submission
  const setDeleteConfirmation = (open: boolean) => {
    setDeleteConfirmationOpen(open || !deleteConfirmationOpen);
  };

  const handleConfirmDelete = async (uid: string) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${uid}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log(`${uid} Article deleted successfully`);
        console.log(response);
        router.push("/my-submissions");
      } else {
        console.error("Failed to delete article");
        setError("Failed to delete article");
      }
    } catch (error) {
      console.error("Failed to delete article", error);
      setError("Failed to delete article");
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
          {/* Error Message */}
          {error && <Typography color="error">{error}</Typography>}
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
            variant="outlined"
            required
            fullWidth
            value={tempYear}
            onChange={(event) => {
              setTempYear(event.target.value);
            }}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              gap: "16px",
            }}
          >
            <Button variant="contained" type="submit">
              {article !== "new" ? "Update Submission" : "Submit Article"}
            </Button>
            {article !== "new" && (
              <Box>
                <DeleteArticle
                  article={formData as Article}
                  open={deleteConfirmationOpen}
                  onClose={setDeleteConfirmation}
                  onConfirm={() => handleConfirmDelete(formData.uid || "")}
                />
                <Button
                  variant="contained"
                  onClick={() => setDeleteConfirmation(true)}
                >
                  Delete Submission
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
