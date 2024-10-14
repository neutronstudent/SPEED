"use client";
import Login from "@/components/Login";
export const dynamic = 'force-dynamic'
// Displays Login component on the page
const LoginPage: React.FC = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
