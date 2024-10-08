import { Article } from "@/types";
import { ErrorOutline, ExpandMore } from "@mui/icons-material";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";

interface ResultsTableProps {
  articles: Article[];
  onClick?: (uid: string) => void;
  buttonLabel?: string;
  statusColumn?: boolean;
  modifyButton?: boolean;
}

const ResultsTable = ({
  articles,
  onClick,
  buttonLabel,
  statusColumn,
  modifyButton,
}: ResultsTableProps) => {
  const { user } = useUser();
  const [expandedArticleUid, setExpandedArticleUid] = useState<string | null>(
    null
  );
  const [numberColumns, setNumberColumns] = useState(6);
  const router = useRouter();
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

  const handleModify = (uid: string) => {
    router.push(`/modify-status?uid=${uid}`);
  };

  useEffect(() => {
    if (statusColumn) {
      setNumberColumns(numberColumns + 1);
    }
    if (buttonLabel) {
      setNumberColumns(numberColumns + 1);
    }
  }, []);

  const handleRowClick = (uid: string) => {
    setExpandedArticleUid((prevUid) => (prevUid === uid ? null : uid));
  };

  // Function to render the details of the article
  const renderDetail = (label: string, value?: string) => {
    if (!value) {
      return null;
    }
    return (
      <Typography variant="body1" gutterBottom>
        <strong>{label}:</strong> {value}
      </Typography>
    );
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
            {statusColumn && <TableCell align="center">Status</TableCell>}
            <TableCell align="center">Details</TableCell>
            {buttonLabel && <TableCell align="center">Actions</TableCell>}
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
                  {statusColumn && (
                    <TableCell align="center">
                      <Box display="flex" alignItems="center">
                        {article.modNote && (
                          <Tooltip title={article.modNote}>
                            <IconButton size="small">
                              <ErrorOutline color="warning" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {getArticleStatus(article.status)}
                        {statusColumn && modifyButton ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleModify(article.uid || "")}
                            sx={{ m: 0.5 }}
                          >
                            Modify
                          </Button>
                        ) : null}
                      </Box>
                    </TableCell>
                  )}
                  {/*Button for Article Details */}
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleRowClick(article.uid || "")}
                    >
                      <ExpandMore />
                    </IconButton>
                  </TableCell>
                  {/* Button for Edit, Moderate, or Analyse */}
                  {buttonLabel && (
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          article.status.toUpperCase() !== "NEW" &&
                          user?.role !== "Moderator" &&
                          user?.role !== "Analyst"
                        }
                        onClick={() => onClick && onClick(article.uid || "")}
                      >
                        {buttonLabel}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={numberColumns}
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
                        {renderDetail("Moderation Note", article.modNote || "")}
                        {renderDetail("SEP", article.SEP)}
                        {renderDetail("Authors", article.authors)}
                        {renderDetail("Pages", article.pages)}
                        {renderDetail("Volume", article.vol)}
                        {renderDetail("Claim", article.claim)}
                        {renderDetail("Result", article.result)}
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
