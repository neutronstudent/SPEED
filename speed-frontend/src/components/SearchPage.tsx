import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import ResultsTable from "./ResultsTable";
import { useUser } from "./UserContext"; // Assuming you have a UserContext to get user role

const drawerWidth = 0; // Space reserved for the sidenav

const SearchPage: React.FC = () => {
  const { user } = useUser(); // Get the user and their role
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // Fetch default approved articles based on user role
  const fetchDefaultApprovedArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${backendUrl}/api/articles?status=APPROVED`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      console.log(data);
      setSearchResults(data);
    } catch (err) {
      setError("No articles found or server error");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search based on query
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      let apiUrl = `${backendUrl}/api/articles?text=${encodeURIComponent(
        searchQuery
      )}`;

      if (user?.role === "Moderator") {
        const approvedResponse = await fetch(
          `${backendUrl}/api/articles?text=${encodeURIComponent(
            searchQuery
          )}&status=APPROVED`
        );
        const deniedResponse = await fetch(
          `${backendUrl}/api/articles?text=${encodeURIComponent(
            searchQuery
          )}&status=DENIED`
        );

        const approvedArticles = await approvedResponse.json();
        const deniedArticles = await deniedResponse.json();

        setSearchResults([...approvedArticles, ...deniedArticles]);
      } else {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (err) {
      setError("No articles found or server error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch default approved articles when the component mounts
  useEffect(() => {
    fetchDefaultApprovedArticles(); // Fetch default articles
    console.log(searchResults);
  }, []); // Fetch whenever the user role is available/changes

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        mt: 8,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Search Articles
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
          onClick={handleSearch} // Search with query
          sx={{ ml: 2, height: "56px" }}
          disabled={loading}
        >
          Search
        </Button>
      </Box>

      {/* Show loading state */}
      {loading && <Typography>Loading...</Typography>}

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Table with Search Results */}
      <ResultsTable
        articles={searchResults}
        statusColumn={user?.role === "Moderator" || user?.role === "Analyst"}
      />
    </Box>
  );
};

export default SearchPage;
