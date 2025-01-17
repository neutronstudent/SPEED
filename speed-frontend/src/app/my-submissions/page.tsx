"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ResultsTable from "@/components/ResultsTable";
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import EditArticleButton from "@/components/EditArticleButton";
import { Article } from "@/types";

const MySubmissionPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  //   const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // Function to handle search
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      //   const apiUrl = `${backendUrl}/api/articles`;
      const apiUrl = `${backendUrl}/api/articles?submitter=${user?.uid || ""}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError("No articles found or server error");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, user?.uid]);

  useEffect(() => {
    if (user) {
      handleSearch();
    }
  }, [user, handleSearch]);

  const editButton = (article: Article) => {
    return <EditArticleButton disabled={!(article.status.toUpperCase() === "NEW")} articleId={article.uid || ""} />;
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
        My Submissions
      </Typography>

      {/* Show loading state */}
      {loading && <Typography>Loading...</Typography>}

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Table with Search Results */}
      <ResultsTable
        statusColumn={true}
        modifyButton={false}
        articles={searchResults}
        actionButton={editButton}
      />
    </Box>
  );
};

export default MySubmissionPage;
