import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

type UseDownloadArgs = {
  readonly uri: string;
  queryKey: ReadonlyArray<unknown>;
};

const getBlob = async (uri: string) => {
  const { data: blob, headers } = await api.get(uri, { responseType: "blob" });
  return { blob, contentDisposition: headers["content-disposition"] };
};

export const useDownloadAttachment = ({ uri, queryKey }: UseDownloadArgs) => {
  const { refetch, isFetching, error, data } = useQuery({
    queryKey: [...queryKey],
    queryFn: () => getBlob(uri),
    enabled: false,
  });

  return {
    download: refetch,
    isDownloading: isFetching,
    error,
    content: data?.contentDisposition,
  };
};
