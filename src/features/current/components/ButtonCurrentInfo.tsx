import { useFetchCurrentOverviewInfo } from "@/features/current/hooks/useFetchCurrent";
import { useNavigate } from "react-router-dom";

const ButtonCurrentInfo = () => {
  const { data, error, isLoading } = useFetchCurrentOverviewInfo(true);
  const nav = useNavigate();

  const { username, email } = data?.data ?? { username: "-", email: "-" };

  if (isLoading)
    return (
      <>
        <div
          className={"flex gap-2 p-2 animate-pulse max-w-fit overflow-x-hidden"}
        >
          <span
            className={"size-2 rounded-full text-text-secondary truncate"}
          />
          <span
            className={"size-2 rounded-full text-text-secondary truncate"}
          />
          <span
            className={"size-2 rounded-full text-text-secondary truncate"}
          />
        </div>
      </>
    );

  if (error)
    return (
      <div className={"inline-flex items-start max-w-fit overflow-hidden"}>
        <p
          className={"truncate text-danger-emphasis danger"}
          aria-live={"polite"}
          title={error.message}
        >
          {error.message}
        </p>
      </div>
    );

  return (
    <button
      className={
        "flex gap-x-3 w-full items-center rounded border border-border-emphasis px-3 py-2 hover:bg-surface-secondary-over cursor-pointer"
      }
      onClick={() => nav("/administration/settings")}
    >
      <span
        className={"flex items-center size-7 rounded-full bg-indigo-700 p-2"}
      >
        {username.charAt(0).toUpperCase()}
      </span>
      <div className={"grid max-w-32 overflow-x-hidden"}>
        <p
          className={"text-start truncate text-text-primary text-sm"}
          title={username}
        >
          {username}
        </p>
        <p
          className={"text-start truncate text-text-secondary text-sm"}
          title={email}
        >
          {email}
        </p>
      </div>
    </button>
  );
};

export default ButtonCurrentInfo;
