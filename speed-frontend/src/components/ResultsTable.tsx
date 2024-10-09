import { Article } from "@/types";
import { ExpandMore } from "@mui/icons-material";
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
  TableSortLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [sortedArticles, setSortedArticles] = useState<Article[]>(articles);
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortedOrder, setSortedOrder] = useState<"asc" | "desc">("asc");
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

  const sortColumn = (column: string) => {
    if (sortedColumn === column) {
      setSortedOrder(sortedOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortedOrder("asc");
    }
    const sortedArticles = articles.sort((a, b) => {
      if (sortedOrder === "asc") {
        return a[column as keyof Article]?.toString().localeCompare(b[column as keyof Article]?.toString() || "", undefined, { numeric: true }) as number;
      } else {
        return b[column as keyof Article]?.toString().localeCompare(a[column as keyof Article]?.toString() || "", undefined, { numeric: true }) as number;
      }
    });
    setSortedArticles(sortedArticles);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center"><TableSortLabel direction={sortedOrder} active={sortedColumn == "title"} onClick={() => sortColumn("title")}>Title</TableSortLabel></TableCell>
            <TableCell align="center"><TableSortLabel>DOI</TableSortLabel></TableCell>
            <TableCell align="center"><TableSortLabel>Journal Name</TableSortLabel></TableCell>
            <TableCell align="center"><TableSortLabel>Year of Publication</TableSortLabel></TableCell>
            {statusColumn && <TableCell align="center"><TableSortLabel>Status</TableSortLabel></TableCell>}
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
                      {getArticleStatus(article.status)}
                      {statusColumn && modifyButton ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleModify(article.uid || "")}
                          sx={{ m: 0.5 }}>
                          Modify
                        </Button>
                      ) : null}
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
                        <Typography variant="body1" gutterBottom>
                          <strong>SEP:</strong> {article.SEP}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Authors:</strong> {article.authors}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Pages:</strong> {article.pages}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Volume:</strong> {article.vol}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Claim:</strong> {article.claim}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Result:</strong> {article.result}
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
