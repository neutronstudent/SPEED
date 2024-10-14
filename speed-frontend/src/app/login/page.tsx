"use client";
import Login from "@/components/Login";
//force dynamic rendering to see if it fixes issue
//export const dynamic = 'force-dynamic'
// Displays Login component on the page
const LoginPage: React.FC = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
