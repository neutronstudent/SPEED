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
  const uid = searchParams.get("uid");

  return uid ? (
    <SubmissionForm article={uid as string} />
  ) : (
    <Typography>No UID provided</Typography>
  );
}

export default function SubmissionPage() {
  return (
    <div>
      <Suspense>
        <GetUid />
      </Suspense>
    </div>
  );
}
