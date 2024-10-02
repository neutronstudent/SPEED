import { Article } from "@/types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Collapse,
  Typography,
} from "@mui/material";
import React from "react";

interface ResultsTableProps {
  articles: Article[];
  onClick?: (uid: string) => void;
  onArticleDetails?: (uid: string) => void;
  buttonLabel?: string;
  statusColomn?: boolean;
}

const ResultsTable = ({
  articles,
  onClick,
  buttonLabel,
  statusColomn,
  onArticleDetails,
}: ResultsTableProps) => {
  const [expandedArticleUid, setExpandedArticleUid] = React.useState<
    string | null
  >(null);
  const getArticleStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "NEW":
        return "New";
      case "MODERATED":
        return "Moderated";
      case "APPROVED":
        return "Approved";
      case "DENIED":
        return "Denied";
      default:
        return "N/A";
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">DOI</TableCell>
            <TableCell align="center">Journal Name</TableCell>
            <TableCell align="center">Year of Publication</TableCell>
            {statusColomn && <TableCell align="center">Status</TableCell>}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <React.Fragment key={article.uid}>
                <TableRow>
                  <TableCell align="center">{article.title}</TableCell>
                  <TableCell align="center">{article.doi || "N/A"}</TableCell>
                  <TableCell align="center">
                    {article.journalName || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {article.yearOfPub
                      ? new Date(article.yearOfPub).getFullYear()
                      : "N/A"}
                  </TableCell>
                  {statusColomn && (
                    <TableCell align="center">
                      {getArticleStatus(article.status)}
                    </TableCell>
                  )}
                  {/* Button for Edit, Moderate, or Analyse */}
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onClick && onClick(article.uid || "")}
                    >
                      {buttonLabel}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={expandedArticleUid === article.uid}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Article Details
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {article.SEP}
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={6}>
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;
