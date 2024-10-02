import React from "react";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface EditArticleButtonProps {
  articleId: string;
}

const EditArticleButton: React.FC<EditArticleButtonProps> = ({ articleId }) => {
  const router = useRouter();
  const handleEdit = (uid: string) => {
    // Redirect to edit page
    console.log("Edit article with uid:", uid);
    router.push(`/submit?uid=${uid}`);
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleEdit(articleId)}
      >
        Edit
      </Button>
    </Box>
  );
};

export default EditArticleButton;
