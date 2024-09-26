"use client";
import React, { Suspense, useEffect, useState } from "react";
import SubmissionForm from "@/components/SubmissionForm";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";

const SubmissionPage: React.FC = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  useEffect(() => {
    console.log("UID:", uid);
  }, [uid]);

  return (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      <SubmissionForm article={uid as string} />
    </Suspense>
  );
};

export default SubmissionPage;
