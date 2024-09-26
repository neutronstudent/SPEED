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

  return (
    
    <div>
      <Typography variant="h4" gutterBottom>
        Edit Submission
      </Typography>
      <Suspense>
      {GetUid() ? (
        <SubmissionForm article={GetUid() as string} />
      ) : (
        <Typography>No UID provided</Typography>
      )}
      </Suspense>
    </div>
  );
};

export default SubmissionPage;
