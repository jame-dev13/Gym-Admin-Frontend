import { useNavigate } from "react-router-dom";

const FALLBACK_ROUTE = "/not-found";

const useAppNavigation = (to?: string, fallback?: string) => {
  const navigate = useNavigate();

  const nav = () => {
    if (to) return navigate(to);
    return navigate(FALLBACK_ROUTE);
  };

  const fallbackTo = () => {
    if (fallback) return navigate(fallback);
    return navigate(FALLBACK_ROUTE);
  };

  const back = () => navigate(-1);

  return { nav, fallback: fallbackTo, back };
};

export { useAppNavigation };
