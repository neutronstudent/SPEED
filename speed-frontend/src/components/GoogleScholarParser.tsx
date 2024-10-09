import { Article } from "@/types";
import { Button } from "@mui/material";
import React from "react";

// takes an article object and generates a google scholar search query
const GoogleScholarParser = ({ article }: { article: Article }) => {
  const searchQuery = `${article.title} ${article.authors} ${
    article.journalName
  } ${article.yearOfPub.getFullYear()}`;
  const googleScholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(
    searchQuery
  )}`;

  return (
    <Button href={googleScholarUrl} target="_blank" rel="noreferrer">
      Search Google Scholar for this article
    </Button>
  );
};

export default GoogleScholarParser;
