"use client";
import React, { useEffect } from "react";
import ModerationAnalystForm from "@/components/ModerationAnalystForm";
import { useRouter, useSearchParams } from "next/navigation";

const AnalysisPage: React.FC = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  useEffect(() => {
    console.log("UID:", uid);
  }, [uid]);

  return (
    <div>
      <h1>Analysis Page</h1>
      {uid && <ModerationAnalystForm articleUid={uid as string} />}
    </div>
  );
};

export default AnalysisPage;
