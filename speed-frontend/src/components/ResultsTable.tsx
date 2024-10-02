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
} from "@mui/material";

interface ResultsTableProps {
  articles: Article[];
  onClick?: (uid: string) => void;
  buttonLabel?: string;
  statusColomn?: boolean;
}

const ResultsTable = ({
  articles,
  onClick,
  buttonLabel,
  statusColomn,
}: ResultsTableProps) => {
  const getArticleStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "NEW":
        return "New";
      case "MODERATED":
        return "Moderated";
      case "APPROVED":
        return "Approved";
      case "REJECTED":
        return "Rejected";
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
            {buttonLabel && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <TableRow key={article.uid}>
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
