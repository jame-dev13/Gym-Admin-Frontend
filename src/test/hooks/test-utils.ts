import { getQueryAppClient } from "@/services/query-client";
import type { Page } from "@/types/Types";
import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, type RenderHookOptions } from "@testing-library/react";
import { createElement, type ReactNode } from "react";

export const API_BASE_URL = import.meta.env.VITE_BASE as string;

export type Show = {
  id: number;
  title: string;
};

export const shows: Show[] = [
  { id: 1, title: "Night Show" },
  { id: 2, title: "Matinee Show" },
];

export const featuredShows: Show[] = [{ id: 3, title: "Encore Show" }];

export const showPage: Page<Show> = {
  content: shows,
  page: { size: 2, number: 0, totalElements: 2, totalPages: 1 },
};

const prepareQueryClient = () => {
  const client = getQueryAppClient();
  client.clear();
  client.setDefaultOptions({
    queries: { retry: false },
    mutations: { retry: false },
  });
  return client;
};

export const renderClientHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props>,
) => {
  const client = prepareQueryClient();

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);

  return { ...renderHook(render, { ...options, wrapper }), client };
};