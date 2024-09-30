// pages/protected.tsx (Example of a protected page)
import useAuthRedirect from '@/hooks/useAuthRedirect';

const ProtectedPage = () => {
  // Specify the roles allowed to access this page
  const allowedRoles = ['admin', 'editor']; // Example roles

  useAuthRedirect(allowedRoles); // Call the redirect hook with allowed roles

  return (
    <div>
      <h1>Protected Content</h1>
    </div>
  );
};

export default ProtectedPage;
