import React from "react";
import { Box, Button, Icon } from "@mui/material";
import { useRouter } from "next/navigation";

interface DeleteArticleButtonProps {
  articleId: string;
}

const DeleteArticleButton: React.FC<DeleteArticleButtonProps> = ({
  articleId,
}) => {
  const router = useRouter();
  const handleDelete = (uid: string) => {
    // Redirect to edit page
    console.log("Delete article with uid:", uid);
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDelete(articleId)}
      >
        <Icon
          sx={{
            fontSize: 20,
          }}
        >
          delete
        </Icon>
      </Button>
    </Box>
  );
};

export default DeleteArticleButton;
