"use client";
import React, { useEffect, useState } from "react";
import SubmissionForm from "@/components/SubmissionForm";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";

const SubmissionPage: React.FC = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  useEffect(() => {
    console.log("UID:", uid);
  }, [uid]);

  return <SubmissionForm article={uid as string} />;
};

export default SubmissionPage;
