"use client";
import React, { Suspense, useEffect, useState } from "react";
// import SubmissionForm from "@/components/SubmissionForm";
import { useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const SubmissionForm = dynamic(() => import("@/components/SubmissionForm"), {
  ssr: false,
});

function getUid() {
  const searchParams = useSearchParams();
  return searchParams.get("uid");
}

const SubmissionPage: React.FC = () => {
  
  const uid = getUid();

  useEffect(() => {
    console.log("UID:", uid);
  }, [uid]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Edit Submission
      </Typography>
      {uid ? (
        <SubmissionForm article={uid as string} />
      ) : (
        <Typography>No UID provided</Typography>
      )}
    </div>
  );
};

export default SubmissionPage;
