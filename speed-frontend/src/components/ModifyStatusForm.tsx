"use client";
import { Article } from "@/types";
import { TextField, Button, Divider, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";

interface ModifyStatusFormProps {
  articleUid?: string;
}

export default function ModifyStatusForm({
  articleUid,
}: ModifyStatusFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<Article | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  //const [analysis, setAnalysis] = useState<string>(""); < for the analysts' note
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
        if (data.status === "APPROVED") {
          handleDecision("approve");
        } else if (data.status === "DENIED") {
          handleDecision("reject");
        }
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

  // Handle feedback input change
  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(event.target.value);
  };

  /*
  const handleAnalysisChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnalysis(event.target.value);
  };*/

  // Handle the decision buttons
  const handleDecision = (decisionType: "reject" | "approve") => {
    setDecision(decisionType);
  };

  // Handle form submission (Confirm button)
  const handleConfirm = async () => {
    if ((user?.role === "Moderator" && !decision) || (user?.role === "Analyst" && !decision)) {
      alert("Please select a decision (Reject or Approve) before confirming.");
      return;
    }

    try {
      let updatedStatus = "";
      let patchData: any = {};

      if (user?.role === "Moderator") {
        updatedStatus = decision === "approve" ? "MODERATED" : "DENIED";
        patchData = { modNote: feedback, status: updatedStatus }; 
      } else if (user?.role === "Analyst") {
        updatedStatus = "APPROVED"; 
        updatedStatus = decision === "approve" ? "MODERATED" : "DENIED";
        patchData = { reviewNote: feedback, status: updatedStatus };
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
        router.push("/modify-status-success");
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
        {"Modify Status"}
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
          <h3>{`${formData.title}`}</h3>
          {user?.role === "Analyst" && (
          <TextField
            label="Moderator's Feedback"
            value={formData.modNote || "No feedback from moderator"}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        )}
          {/* Feedback or Analysis TextField */}
          {user?.role === "Moderator" && (
          <TextField
          label= "Feedback" //{user?.role === "Moderator" ? "Feedback" : "Analysis"}
          value= {feedback}//{user?.role === "Moderator" ? feedback : analysis}
          onChange= {handleFeedbackChange}//{user?.role === "Moderator" ? handleFeedbackChange : handleAnalysisChange}
          fullWidth
          multiline
          rows={4}
        />
          )}
        <Divider />

          {user?.role === "Moderator" || user?.role === "Analyst" ? (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {/* Decision Buttons for Moderator */}
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

          {/* Confirm Button */}
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