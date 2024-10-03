"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const ModifyStatusForm = dynamic(() => import("@/components/ModifyStatusForm"), { ssr: false });

function GetUid() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  return uid ? (
    <ModifyStatusForm articleUid={uid as string} />
  ) : (
    <Typography>No UID provided</Typography>
  );
}

export default function ModifyStatusPage() {
  return (
    <div>
      <Suspense>
        <GetUid />
      </Suspense>
    </div>
  );
}
