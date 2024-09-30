"use client";
import React, { Suspense, useEffect } from "react";
import ModerationAnalystForm from "@/components/ModerationAnalystForm";
import { useRouter, useSearchParams } from "next/navigation";

const ModerationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  useEffect(() => {
    console.log("UID:", uid);
  }, [uid]);

  return (
    <div>
      <h1>Moderation Page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {uid && <ModerationAnalystForm articleUid={uid as string} />}
      </Suspense>
    </div>
  );
};

export default ModerationPage;
