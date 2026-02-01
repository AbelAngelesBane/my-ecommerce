import { useApi } from "@/lib/api";
import { ProductResponse } from "@/types/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export function useProducts({ category }: { category: string }) {
  const { api } = useApi();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", category],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<ProductResponse>(
        `/products/category/${category}?page=${pageParam}`,
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If last page has data, return next page number, else undefined
      const typedLastPage = lastPage as ProductResponse; //to object response then
      //if products.length is greater than 0 then allPages + 1, all pages coming from tanstack
      return (typedLastPage.products?.length ?? 0) > 0
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  return {
    data,
    isSuccess,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    queryClient,
    error,
  };
}
