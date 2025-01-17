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
  Box,
  Collapse,
  Typography,
  IconButton,
  Tooltip,
  TableSortLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";

interface ResultsTableProps {
  articles: Article[];
  actionButton?: (article: Article) => React.ReactNode;
  statusColumn?: boolean;
  modifyButton?: boolean;
}
const ResultsTable = ({
  articles,
  actionButton,
  statusColumn,
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
    if (actionButton) {
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

  const sortColumn = async (column: string) => {
    let state = "asc";
    if (sortedColumn === column) {
      state = sortedOrder === "asc" ? "desc" : "asc";
      setSortedOrder(sortedOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortedOrder("asc");
    }
    const sortedArticles = articles.sort((a, b) => {
      if (state === "asc") {
        return a[column as keyof Article]
          ?.toString()
          .localeCompare(
            b[column as keyof Article]?.toString() || "",
            undefined,
            { numeric: true }
          ) as number;
      } else {
        return b[column as keyof Article]
          ?.toString()
          .localeCompare(
            a[column as keyof Article]?.toString() || "",
            undefined,
            { numeric: true }
          ) as number;
      }
    });
    setSortedArticles(sortedArticles);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <TableSortLabel
                direction={sortedOrder}
                active={sortedColumn == "title"}
                onClick={() => sortColumn("title")}
              >
                Title
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                direction={sortedOrder}
                active={sortedColumn == "doi"}
                onClick={() => sortColumn("doi")}
              >
                DOI
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                direction={sortedOrder}
                active={sortedColumn == "journalName"}
                onClick={() => sortColumn("journalName")}
              >
                Journal Name
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                direction={sortedOrder}
                active={sortedColumn == "yearOfPub"}
                onClick={() => sortColumn("yearOfPub")}
              >
                Year of Publication
              </TableSortLabel>
            </TableCell>
            {statusColumn && (
              <TableCell align="center">
                <TableSortLabel
                  direction={sortedOrder}
                  active={sortedColumn == "status"}
                  onClick={() => sortColumn("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell align="center">Details</TableCell>
            {actionButton && <TableCell align="center">Actions</TableCell>}
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
                  {actionButton && (
                    <TableCell align="center">
                      {actionButton(article)}
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
