import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Article } from "@/types";

// Defines the props for the DeleteArticle Component
interface DeleteArticleProps {
  open: boolean;
  article: Article;
  onConfirm: (id: string) => void;
  onClose: (open: boolean) => void;
}

/**
 * DeleteArticle Component that renders a dialog box to confirm deletion of an article
 * @returns a dialog box that asks the user to confirm deletion of an article
 */
const DeleteArticle: React.FC<DeleteArticleProps> = ({
  open,
  article,
  onConfirm,
  onClose,
}) => {
  const handleClose = () => {
    onClose(false);
  };

  const handleConfirmDelete = () => {
    onConfirm(article.id);
    onClose(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {article.title}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteArticle;
