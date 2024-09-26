import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';

const drawerWidth = 240; // Space reserved for the sidenav

const SearchPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''; 
  
    // Function to handle search
    const handleSearch = async () => {
      setLoading(true);
      setError(null); 
  
      try {
        const apiUrl = `${backendUrl}/api/articles/search?text=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
  
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError('No articles found or server error');
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Search Articles
        </Typography>
  
        {/* Search Input and Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
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
            sx={{ ml: 2, height: '56px' }} 
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">DOI</TableCell>
                <TableCell align="center">Journal Name</TableCell>
                <TableCell align="center">Year of Publication</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.length > 0 ? (
                searchResults.map((article) => (
                  <TableRow key={article.uid}>
                    <TableCell align="center">{article.title}</TableCell>
                    <TableCell align="center">{article.doi || 'N/A'}</TableCell>
                    <TableCell align="center">{article.journalName || 'N/A'}</TableCell>
                    <TableCell align="center">
                      {article.yearOfPub ? new Date(article.yearOfPub).getFullYear() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">{article.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  
  export default SearchPage;