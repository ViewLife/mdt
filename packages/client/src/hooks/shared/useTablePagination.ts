import * as React from "react";
import useFetch from "lib/useFetch";

export function useTablePagination<T>(initialData: T) {
  const [data, setData] = React.useState(initialData);
  const { execute } = useFetch();

  async function paginationFetch({ path }: { path: string }) {
    return async function paginationFetch({
      pageSize,
      pageIndex,
    }: {
      pageSize: number;
      pageIndex: number;
    }) {
      const { json } = await execute(path, {
        params: {
          skip: pageSize * pageIndex,
        },
      });

      setData(json);
    };
  }

  return { data, paginationFetch };
}
