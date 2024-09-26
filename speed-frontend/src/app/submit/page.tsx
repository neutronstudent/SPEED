"use client";
import React, { Suspense, useEffect, useState } from "react";
// import SubmissionForm from "@/components/SubmissionForm";
import { useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const SubmissionForm = dynamic(() => import("@/components/SubmissionForm"), {
  ssr: false,
});


function GetUid() {
  const searchParams = useSearchParams();
  return searchParams.get("uid");
}

const SubmissionPage: React.FC = () => {
  
  const uid = GetUid();

  useEffect(() => {
    console.log("UID:", uid);
  }, [uid]);

  return (
    <Suspense>
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
    </Suspense>
  );
};

export default SubmissionPage;
