import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  endpointOrMethodOrOptions: string,
  endpointOrOptions?: string | RequestInit,
  bodyOrOptions?: any
): Promise<Response> {
  let endpoint: string;
  let options: RequestInit = {};

  // Handle different calling patterns
  if (typeof endpointOrOptions === 'string') {
    // apiRequest(method, endpoint, body)
    const method = endpointOrMethodOrOptions;
    endpoint = endpointOrOptions as string;
    
    if (bodyOrOptions) {
      options = {
        method,
        body: typeof bodyOrOptions === 'string' ? bodyOrOptions : JSON.stringify(bodyOrOptions),
      };
    } else {
      options = { method };
    }
  } else {
    // apiRequest(endpoint, options?)
    endpoint = endpointOrMethodOrOptions;
    if (endpointOrOptions && typeof endpointOrOptions !== 'string') {
      options = endpointOrOptions as RequestInit;
    }
  }

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
