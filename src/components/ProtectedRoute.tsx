interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Authentication disabled
  return <>{children}</>;
};

export default ProtectedRoute;