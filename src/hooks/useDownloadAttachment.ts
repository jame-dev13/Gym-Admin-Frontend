import { api } from "@/services/api";
import type { ApiErrorResponse } from "@/types/Types";
import { useQuery } from "@tanstack/react-query";

export type UseDownloadAttachmentArgs = {
  readonly uri: string;
  readonly queryKey: ReadonlyArray<unknown>;
};

export type DownloadedAttachment = Readonly<{
  blob: Blob;
  contentDisposition?: string;
}>;

const downloadAttachment = async (
  uri: string,
): Promise<DownloadedAttachment> => {
  const { data: blob, headers } = await api.get<Blob>(uri, {
    responseType: "blob",
  });

  return {
    blob,
    contentDisposition: headers["content-disposition"] as string | undefined,
  };
};

export const useDownloadAttachment = ({
  uri,
  queryKey,
}: UseDownloadAttachmentArgs) => {
  const { refetch, isFetching, error, data } = useQuery<
    DownloadedAttachment,
    ApiErrorResponse
  >({
    // `uri` is part of the cache identity. Without it, two attachments that
    // share the same `queryKey` would reuse each other's cached blob and
    // Content-Disposition, and switching `uri` would expose stale data.
    queryKey: [...queryKey, uri],
    queryFn: () => downloadAttachment(uri),
    enabled: false,
  });

  return {
    download: refetch,
    isDownloading: isFetching,
    error,
    content: data?.contentDisposition,
    // The fetched blob used to be dropped, leaving no way to save the file.
    blob: data?.blob,
  };
};
