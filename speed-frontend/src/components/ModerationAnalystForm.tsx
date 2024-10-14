"use client";
import { Article } from "@/types";
import { TextField, Button, Divider, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";
import GoogleScholarParser from "./GoogleScholarParser";

interface ModerationAnalystFormProps {
  articleUid: string;
}

export default function ModerationAnalystForm({
  articleUid,
}: ModerationAnalystFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<Article | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [analystNote, setAnalystNote] = useState<string>("");
  const [decision, setDecision] = useState<"reject" | "approve" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempYear, setTempYear] = useState<string>("");

  // Function to fetch article data
  const fetchArticle = async (uid: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${uid}`
      );
      if (response.ok) {
        let data = await response.json();
        console.log("Fetched article data:", data);
        data.yearOfPub = new Date(data.yearOfPub);
        setFormData(data as Article);
        setTempYear(data.yearOfPub.getFullYear().toString());
      } else {
        console.error("Failed to fetch article data");
      }
    } catch (error) {
      console.error("Failed to fetch article data", error);
    } finally {
      setLoading(false);
    }
  };

  // Populate the form with the article data
  useEffect(() => {
    if (articleUid) {
      fetchArticle(articleUid);
    }
  }, [articleUid]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Special handling for yearOfPub to convert it to a Date
    if (name === "yearOfPub") {
      setTempYear(value);
    } else {
      setFormData((prevData) =>
        prevData
          ? {
              ...prevData,
              [name]: value,
            }
          : null
      );
    }
  };

  // Handle feedback input change
  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(event.target.value);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnalystNote(event.target.value);
  };

  // Handle the decision buttons (for Moderator)
  const handleDecision = (decisionType: "reject" | "approve") => {
    setDecision(decisionType);
  };

  // Allow analysts to save drafts without modifying the status
  const handleSaveDraft = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${articleUid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData }),
        }
      );

      if (response.ok) {
        console.log("Draft saved successfully");
        router.push("/moderator-analyst");
      } else {
        console.error("Failed to save draft");
      }
    } catch (error) {
      console.error("Failed to save draft", error);
    }
  };

  // Handle form submission (Confirm button)
  const handleConfirm = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    if (user?.role === "Moderator" && !decision) {
      alert("Please select a decision (Reject or Approve) before confirming.");
      return;
    }

    if (decision !== "reject") {
      if (tempYear.length !== 4) {
        setError("Year of publication must be 4 digits long");
        return;
      }
      if (tempYear.match(/[^0-9]/)) {
        setError("Year of publication must be a number");
        return;
      }
      if (tempYear < "1700" || tempYear > new Date().getFullYear().toString()) {
        setError("Year of publication must be between 1000 and current year");
        return;
      }
    }

    try {
      let updatedStatus = "";
      let patchData: any = { ...formData, yearOfPub: new Date(tempYear) };

      if (user?.role === "Moderator") {
        updatedStatus = decision === "approve" ? "MODERATED" : "DENIED";
        patchData = { ...patchData, modNote: feedback, status: updatedStatus };
      } else if (user?.role === "Analyst") {
        updatedStatus = "APPROVED";
        patchData = {
          ...patchData,
          reviewNote: analystNote,
          status: updatedStatus,
        };
      }

      console.log("Sending PATCH request with data:", patchData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${articleUid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patchData),
        }
      );

      if (response.ok) {
        console.log("Form submitted successfully");
        router.push(
          `/${
            user?.role === "Moderator"
              ? "moderation-success"
              : "analysis-success"
          }`
        );
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Failed to submit form", error);
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
      <h1>
        {user?.role === "Moderator" ? "Moderation Review" : "Analysis Review"}
      </h1>
      {!formData ? (
        <p>{loading ? "Loading article data..." : "No article data found"}</p>
      ) : (
        <Box
          component="form"
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
            label="Submission Title"
            name="title"
            value={formData.title}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Authors"
            name="authors"
            value={formData.authors}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Journal Name"
            name="journalName"
            value={formData.journalName}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Year of Publication"
            name="yearOfPub"
            value={tempYear}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Volume"
            name="vol"
            value={formData.vol || "N/A"}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Pages"
            name="pages"
            value={formData.pages || "N/A"}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="DOI"
            name="doi"
            value={formData.doi || "N/A"}
            fullWidth
            onChange={handleChange}
          />
          <Divider />
          <TextField
            label="Software Engineering Practice"
            name="SEP"
            value={formData.SEP}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Claim"
            name="claim"
            value={formData.claim}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Evidence Result"
            name="result"
            value={formData.result}
            fullWidth
            onChange={handleChange}
          />
          <Divider />
          {/* {user?.role === "Moderator" && ( */}
          <TextField
            label="Moderator Feedback"
            name="modNote"
            value={formData.modNote}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          {/* )} */}
          {user?.role === "Analyst" && (
            <TextField
              label="Analysis Notes"
              name="reviewNote"
              value={formData.reviewNote}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          )}
          <Divider />
          <GoogleScholarParser article={formData} />
          {user?.role === "Moderator" ? (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant={decision === "reject" ? "contained" : "outlined"}
                color="error"
                onClick={() => handleDecision("reject")}
              >
                Reject
              </Button>
              <Button
                variant={decision === "approve" ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleDecision("approve")}
              >
                Approve
              </Button>
            </Box>
          ) : null}
          {user?.role === "Analyst" && (
            <Button variant="contained" onClick={handleSaveDraft}>
              Save Draft
            </Button>
          )}
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirm}
            sx={{ mt: 2 }}
          >
            Confirm
          </Button>
        </Box>
      )}
    </Box>
  );
}
