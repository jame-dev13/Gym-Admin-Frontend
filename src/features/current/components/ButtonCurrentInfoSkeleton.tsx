const animation = "animate-pulse delay-300";

export const ButtonCurrentInfoSkeleton = () => {
  return (
    <div
      className={`flex gap-2 rounded border border-border-emphasis w-fit ${animation}`}
    >
      <div
        className={`size-7 rounded-full bg-text-secondary p-2 ${animation}`}
      />
      <div className={"grid max-w-32 overflow-x-hidden"}>
        <span className={`w-full ${animation} bg-text-secondary h-0.5`}></span>
        <span className={`w-full ${animation} bg-text-secondary h-0.5`}></span>
      </div>
    </div>
  );
};
