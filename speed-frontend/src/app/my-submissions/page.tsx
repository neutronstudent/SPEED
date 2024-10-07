"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ResultsTable from "@/components/ResultsTable";
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import EditArticleButton from "@/components/EditArticleButton";

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
      const apiUrl = `${backendUrl}/api/articles/submitter/${user?.uid || ""}`;
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

  const handleEdit = (uid: string) => {
    // Redirect to edit page
    console.log("Edit article with uid:", uid);
    router.push(`/submit?uid=${uid}`);
  };

  const editButton = (uid: string) => {
    return <EditArticleButton articleId={uid} />;
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
        statusColumn={false}
        articles={searchResults}
        buttonLabel="Edit"
        onClick={handleEdit}
      />
    </Box>
  );
};

export default MySubmissionPage;
