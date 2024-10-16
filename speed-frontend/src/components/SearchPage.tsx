import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import ResultsTable from "./ResultsTable";
import { useUser } from "./UserContext"; // Assuming you have a UserContext to get user role
import { Article } from "@/types";
import { useRouter } from "next/navigation";

const drawerWidth = 0; // Space reserved for the sidenav

const SearchPage: React.FC = () => {
  const { user } = useUser(); // Get the user and their role
  const router = useRouter();
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

    if (!searchQuery) {
      setLoading(false);
      return;
    }

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
  }, [user]); // Fetch whenever the user role is available/changes

  const modifyStatus = (article: Article) => {
    if (user?.role === "Moderator" || user?.role === "Analyst") {
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push(`/modify-status?uid=${article.uid}`)}
          sx={{ m: 0.5 }}
        >
          Modify
        </Button>
      );
    }
    return null;
  };

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
      <form id="search" onSubmit={handleSearch}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => {
              if (e.target.value.length > 0) {
                setSearchQuery(e.target.value);
              } else {
                setSearchQuery("");
                fetchDefaultApprovedArticles();
              }
            }}
          />
          <Button
            variant="contained"
            type="submit"
            color="primary"
            onClick={handleSearch} // Search with query
            sx={{ ml: 2, height: "56px" }}
            disabled={loading}
          >
            Search
          </Button>
        </Box>
      </form>

      {/* Show loading state */}
      {loading && <Typography>Loading...</Typography>}

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Table with Search Results */}
      <ResultsTable
        articles={searchResults}
        actionButton={
          user?.role === "Moderator" || user?.role === "Analyst"
            ? modifyStatus
            : undefined
        }
        statusColumn={user?.role === "Moderator" || user?.role === "Analyst"}
      />
    </Box>
  );
};

export default SearchPage;
