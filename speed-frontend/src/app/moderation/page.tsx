"use client";
import React, { useEffect } from "react";
import ModerationAnalystForm from "@/components/ModerationAnalystForm";
import { useRouter, useSearchParams } from "next/navigation";

const ModerationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  useEffect(() => {
    console.log("UID:", uid); // Log the UID to check if it's being retrieved correctly
  }, [uid]);

  return (
    <div>
      <h1>Moderation Page</h1>
      {/* Pass the `uid` to the form component */}
      {uid && <ModerationAnalystForm articleUid={uid as string} />}
    </div>
  );
};

export default ModerationPage;
