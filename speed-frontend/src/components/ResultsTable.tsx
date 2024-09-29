import { Article } from "@/types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface ResultsTableProps {
  articles: Article[];
  statusColomn?: boolean;
  onClick?: (uid: string) => void;
  editAction?: (uid: string) => React.ReactNode;
}

const ResultsTable = ({
  articles,
  statusColomn,
  onClick,
  editAction,
}: ResultsTableProps) => {
  const getArticleStatus = (status: string) => {
    switch (status) {
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
            {editAction && <TableCell align="center">Edit</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <TableRow
                onClick={() => {
                  onClick && onClick(article.uid || "");
                }}
                key={article.uid}
              >
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
                {editAction && article.status === "NEW" && (
                  <TableCell align="center">
                    {editAction(article.uid || "")}
                  </TableCell>
                )}
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
  );
};

export default ResultsTable;
