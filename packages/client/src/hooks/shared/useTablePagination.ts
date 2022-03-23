import * as React from "react";
import useFetch from "lib/useFetch";

interface FetchOptions {
  pageSize: number;
  pageIndex: number;
  path: string;
  dataKey: string;
}

export function useTablePagination<T>(initialData: T) {
  const [data, setData] = React.useState(initialData);
  const { state, execute } = useFetch();

  async function paginationFetch({ dataKey, path, pageSize, pageIndex }: FetchOptions) {
    const { json } = await execute(path, {
      params: {
        skip: pageSize * pageIndex,
      },
    });

    if (json[dataKey]) {
      setData(json[dataKey]);
    }
  }

  return { data, setData, paginationState: state, paginationFetch };
}
