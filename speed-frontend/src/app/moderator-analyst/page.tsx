"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ResultsTable from "@/components/ResultsTable";
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import { Article } from "@/types";

const ModerationAnalystPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDenied, setShowDenied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // Function to fetch articles based on the user's role (Moderator or Analyst)
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch articles based on the status required by the user's role
      let status = "";
      console.log("Show Denied:", showDenied);
      if (!showDenied) {
        if (user?.role === "Moderator") {
          status = "NEW";
        } else if (user?.role === "Analyst") {
          status = "MODERATED"; // Change this to fetch approved as well
        }
      } else {
        status = "DENIED";
      }

      console.log("Fetching articles with status:", status);
      const apiUrl = `${backendUrl}/api/articles?status=${status}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await response.json();
      setArticles(data);
      console.log(data);
    } catch (err) {
      setError("No articles found or server error");
    } finally {
      setLoading(false);
    }
  }, [user, backendUrl, showDenied]);

  // Fetch articles when the user role changes
  useEffect(() => {
    if (user) {
      console.log("User role:", user.role);
      fetchArticles();
    }
  }, [user, fetchArticles]);

  // React node Action buttons depending on the role
  const actionButton = (article: Article) => {
    return (
      <Box>
        {user?.role === "Moderator" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              router.push(`/moderation?uid=${article.uid}`);
            }}
          >
            Moderate
          </Button>
        )}
        {user?.role === "Analyst" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              router.push(`/analysis?uid=${article.uid}`);
            }}
          >
            Analyse
          </Button>
        )}
      </Box>
    );
  };

  // Filter results based on search query locally
  const searchWithQuery = async () => {
    setLoading(true);
    setError(null);

    // search and filter articles from the fetched articles
    const filteredArticles = articles.filter((article) => {
      return article.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    setArticles(filteredArticles);
    setLoading(false);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        mt: 8,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {user?.role === "Moderator" ? "Moderation" : "Analysis"} Page
      </Typography>

      {/* Search Input and Button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={searchWithQuery} // Search with query
          sx={{ ml: 2, height: "56px" }}
          disabled={loading}
        >
          Search
        </Button>
      </Box>

      <Box>
        <Button
          variant="contained"
          style={{
            margin: 5,
            backgroundColor: `${!showDenied ? "blue" : "grey"}`,
          }}
          onClick={() => {
            setShowDenied(false);
            setSearchQuery("");
          }}
        >
          Show {user?.role === "Moderator" ? "New" : "Moderated"}
        </Button>
        <Button
          variant="contained"
          style={{
            margin: 5,
            backgroundColor: `${showDenied ? "blue" : "grey"}`,
          }}
          onClick={() => {
            setShowDenied(true);
            setSearchQuery("");
          }}
        >
          Show Denied
        </Button>
      </Box>

      {/* Show loading state */}
      {loading && <Typography>Loading...</Typography>}

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Table with Search Results */}
      <ResultsTable
        articles={articles}
        actionButton={actionButton}
        statusColumn={true}
        modifyButton={true}
      />
    </Box>
  );
};

export default ModerationAnalystPage;
