import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const OnboardingRoute = () => {
  const { user, hasLoggedInBefore } = useSelector((state) => state.user);

  if (!user) {
    return (
      <Navigate
        to={hasLoggedInBefore === true ? "/login" : "/landing"}
        replace
      />
    );
  }

  if (user.type) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default OnboardingRoute;
