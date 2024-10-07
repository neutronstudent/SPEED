"use client";
import { Article } from "@/types";
import { TextField, Button, Divider, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";

interface ModerationAnalystFormProps {
  articleUid?: string;
}

export default function ModerationAnalystForm({
  articleUid,
}: ModerationAnalystFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<Article | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [decision, setDecision] = useState<"reject" | "approve" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch article data
  const fetchArticle = async (uid: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/id/${uid}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched article data:", data);
        setFormData(data as Article);
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
      setFormData((prevData) => 
        prevData ? {
          ...prevData,
          [name]: new Date(value), 
        } : null
      );
    } else {
      setFormData((prevData) => 
        prevData ? {
          ...prevData,
          [name]: value,
        } : null
      );
    }
  };

  // Handle feedback input change
  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(event.target.value);
  };

  // Handle the decision buttons (for Moderator)
  const handleDecision = (decisionType: "reject" | "approve") => {
    setDecision(decisionType);
  };

  // Handle form submission (Confirm button)
  const handleConfirm = async () => {
    if (user?.role === "Moderator" && !decision) {
      alert("Please select a decision (Reject or Approve) before confirming.");
      return;
    }

    try {
      let updatedStatus = "";
      let patchData: any = { ...formData }; 

      if (user?.role === "Moderator") {
        updatedStatus = decision === "approve" ? "MODERATED" : "DENIED";
        patchData = { ...patchData, modNote: feedback, status: updatedStatus };
      } else if (user?.role === "Analyst") {
        updatedStatus = "APPROVED";
        patchData = { ...patchData, reviewNote: null, status: updatedStatus };
      }

      console.log("Sending PATCH request with data:", patchData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/id/${articleUid}`,
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
            value={formData.yearOfPub.toString()}
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
          {user?.role === "Analyst" && (
            <TextField
              label="Moderator's Feedback"
              value={formData.modNote || "No feedback from moderator"}
              fullWidth
            />
          )}
          {user?.role === "Moderator" && (
            <TextField
              label="Feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              fullWidth
              multiline
              rows={4}
            />
          )}
          <Divider />
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
