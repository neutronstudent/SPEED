"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ResultsTable from "@/components/ResultsTable";
import { useUser } from "@/components/UserContext";

const SubmissionPage: React.FC = () => {
  const { user } = useUser();
  //   const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  useEffect(() => {
    if (user) {
      handleSearch();
    }
  }, [user]);

  // Function to handle search
  const handleSearch = async () => {
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

      {/* Search Input and Button */}
      {/* <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
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
          onClick={handleSearch}
          sx={{ ml: 2, height: "56px" }}
          disabled={loading}
        >
          Search
        </Button>
      </Box> */}

      {/* Show loading state */}
      {loading && <Typography>Loading...</Typography>}

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Table with Search Results */}
      <ResultsTable articles={searchResults} />
    </Box>
  );
};

export default SubmissionPage;
