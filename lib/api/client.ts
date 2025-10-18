import { createClient } from "@/lib/supabase/client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export class APIClient {
  private static instance: APIClient
  private supabase = createClient()

  private constructor() {}

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient()
    }
    return APIClient.instance
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession()

    return {
      "Content-Type": "application/json",
      ...(session?.access_token && {
        Authorization: `Bearer ${session.access_token}`,
      }),
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }
}

export const apiClient = APIClient.getInstance()
