"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const ModerationAnalystForm = dynamic(() => import("@/components/ModerationAnalystForm"), { ssr: false });

function GetUid() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  return uid ? (
    <ModerationAnalystForm articleUid={uid as string} />
  ) : (
    <Typography>No UID provided</Typography>
  );
}

export default function AnalysisPage() {
  return (
    <div>
      <Suspense>
        <GetUid />
      </Suspense>
    </div>
  );
}
