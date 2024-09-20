"use client";
import { useState, useEffect } from 'react';
// Import firebaseHandler if still needed
// import { firebaseHandler } from "../controller/login";

// Initialize Firebase if needed
// firebaseHandler.init();

import ShowUsers from "../components/ShowUser";

export default function Home() {
  return (
    <main>
      <ShowUsers />
    </main>
  );
}