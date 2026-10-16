import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTableRenderer } from "@/hooks/useTableRenderer";
import type { PageQueryHook } from "@/components/table/tableRendererConfig";
import type { ApiErrorResponse, Page } from "@/types/Types";

type Member = {
  id: number;
  name: string;
  plan: string;
};

function pageOf(content: Member[] = []): Page<Member> {
  return {
    content,
    page: {
      size: 10,
      number: 0,
      totalElements: content.length,
      totalPages: content.length > 0 ? 1 : 0,
    },
  };
}

function createStub(error: ApiErrorResponse | null = null) {
  const seen: Array<Record<string, unknown>> = [];
  const hook = ((params?: Record<string, unknown>) => {
    seen.push({ ...(params ?? {}) });
    return { data: pageOf(), error, isPending: false, isFetching: false };
  }) as unknown as PageQueryHook<Member>;
  return { hook, seen };
}

describe("useTableRenderer", () => {
  it("requests only page and size before any user interaction", () => {
    const { hook, seen } = createStub();
    renderHook(() =>
      useTableRenderer<Member>({ queryFn: hook, sortProperties: ["name", "plan"] }),
    );

    expect(seen[0]).toEqual({ page: 0, size: 10 });
    expect(seen[0]).not.toHaveProperty("sort");
    expect(seen[0]).not.toHaveProperty("search");
  });

  it("does not send sort even when an initial sort is configured", () => {
    const { hook, seen } = createStub();
    renderHook(() =>
      useTableRenderer<Member>({
        queryFn: hook,
        sortProperties: ["name", "plan"],
        initialSortBy: "plan",
        initialDirection: "desc",
      }),
    );

    expect(seen[0]).not.toHaveProperty("sort");
  });

  it("keeps typing out of the request and commits search on submit", () => {
    const { hook, seen } = createStub();
    const { result } = renderHook(() =>
      useTableRenderer<Member>({ queryFn: hook }),
    );

    act(() => result.current.search.onChange("ada"));
    expect(seen.at(-1)).toEqual({ page: 0, size: 10 });
    expect(result.current.search.value).toBe("ada");

    act(() => result.current.search.onSubmit("ada"));
    expect(seen.at(-1)).toMatchObject({ page: 0, search: "ada" });
  });

  it("sends Spring-style sort once a field is selected", () => {
    const { hook, seen } = createStub();
    const { result } = renderHook(() =>
      useTableRenderer<Member>({ queryFn: hook, sortProperties: ["name", "plan"] }),
    );

    act(() => result.current.sort.onSortByChange("plan"));

    expect(seen.at(-1)).toMatchObject({ page: 0, size: 10, sort: "plan,asc" });
  });

  it("activates sort with the default field when only the direction changes", () => {
    const { hook, seen } = createStub();
    const { result } = renderHook(() =>
      useTableRenderer<Member>({ queryFn: hook, sortProperties: ["name", "plan"] }),
    );

    act(() => result.current.sort.onDirectionChange("desc"));

    expect(seen.at(-1)).toMatchObject({ sort: "name,desc" });
  });

  it("maps 1-based UI pages to 0-based backend pages", () => {
    const { hook, seen } = createStub();
    const { result } = renderHook(() =>
      useTableRenderer<Member>({ queryFn: hook }),
    );

    act(() => result.current.pagination.onPageChange(3));

    expect(seen.at(-1)).toMatchObject({ page: 2 });
    expect(result.current.pagination.currentPage).toBe(3);
  });

  it("resets to the first page when search or sort changes", () => {
    const { hook, seen } = createStub();
    const { result } = renderHook(() =>
      useTableRenderer<Member>({ queryFn: hook, sortProperties: ["name"] }),
    );

    act(() => result.current.pagination.onPageChange(4));
    expect(seen.at(-1)).toMatchObject({ page: 3 });

    act(() => result.current.search.onSubmit("ada"));
    expect(seen.at(-1)).toMatchObject({ page: 0, search: "ada" });

    act(() => result.current.pagination.onPageChange(4));
    act(() => result.current.sort.onSortByChange("name"));
    expect(seen.at(-1)).toMatchObject({ page: 0, sort: "name,asc" });
  });

  it("honours custom param names and extra params", () => {
    const { hook, seen } = createStub();
    renderHook(() =>
      useTableRenderer<Member>({
        queryFn: hook,
        queryParamNames: { page: "p", size: "s" },
        extraParams: { role: "ADMIN" },
      }),
    );

    expect(seen[0]).toMatchObject({ p: 0, s: 10, role: "ADMIN" });
  });

  it("throws when an unknown sort value is selected", () => {
    const { hook } = createStub();
    const { result } = renderHook(() =>
      useTableRenderer<Member>({ queryFn: hook, sortProperties: ["name"] }),
    );

    expect(() =>
      act(() => result.current.sort.onSortByChange("unknown")),
    ).toThrow('useTableRenderer received unknown sort value "unknown"');
  });

  it("surfaces the query error", () => {
    const error: ApiErrorResponse = { message: "Members failed", status: 500 };
    const { hook } = createStub(error);
    const { result } = renderHook(() =>
      useTableRenderer<Member>({ queryFn: hook }),
    );

    expect(result.current.error).toMatchObject(error);
  });
});
