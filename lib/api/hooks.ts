import useSWR from "swr"
import { apiClient } from "./client"

export function useAPI<T>(endpoint: string | null, options?: any) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    endpoint,
    async (url: string) => {
      return apiClient.get<T>(url)
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...options,
    },
  )

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}

export function useTradingPools(filters?: { status?: string; risk?: string }) {
  const queryParams = new URLSearchParams(filters as any).toString()
  const endpoint = `/api/trading-pools${queryParams ? `?${queryParams}` : ""}`
  return useAPI<any>(endpoint)
}

export function useTradingPool(id: string | null) {
  return useAPI<any>(id ? `/api/trading-pools/${id}` : null)
}

export function useMyPools() {
  return useAPI<any>("/api/trading-pools/my-pools")
}

export function usePerformanceData(timeframe = "30d") {
  return useAPI<any>(`/api/analytics/performance?timeframe=${timeframe}`)
}

export function useLeaderboard(limit = 10) {
  return useAPI<any>(`/api/analytics/leaderboard?limit=${limit}`)
}

export function usePortfolioAnalytics(userId?: string) {
  return useAPI<any>(userId ? `/api/analytics/portfolio?userId=${userId}` : null)
}

export function useMarketData() {
  return useAPI<any>("/api/analytics/market-data")
}

export function useWalletInfo(address: string | null) {
  return useAPI<any>(address ? `/api/web3/wallet?address=${address}` : null)
}

export function useContracts() {
  return useAPI<any>("/api/web3/contracts")
}

export function useTransactions(address: string | null, limit = 20) {
  return useAPI<any>(address ? `/api/web3/transactions?address=${address}&limit=${limit}` : null)
}
