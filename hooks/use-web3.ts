"use client"

import { useState, useEffect, useCallback } from "react"
import { web3Service, type Web3Provider } from "@/lib/web3/contracts"

export function useWeb3() {
  const [web3State, setWeb3State] = useState<Web3Provider>({
    provider: null,
    signer: null,
    network: null,
    address: null,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const result = await web3Service.connectWallet()
      setWeb3State(result)

      // Save wallet connection to database
      await fetch("/api/web3/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: result.address,
          wallet_type: "metamask",
          network: result.network,
          balance: 0, // Will be updated separately
        }),
      })
    } catch (err: any) {
      setError(err.message)
      console.error("Error connecting wallet:", err)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    web3Service.disconnect()
    setWeb3State({
      provider: null,
      signer: null,
      network: null,
      address: null,
    })
  }, [])

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      await web3Service.switchNetwork(chainId)
      // Reconnect to get updated network info
      const result = await web3Service.connectWallet()
      setWeb3State(result)
    } catch (err: any) {
      setError(err.message)
      console.error("Error switching network:", err)
    }
  }, [])

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            await connectWallet()
          }
        } catch (err) {
          console.error("Error checking wallet connection:", err)
        }
      }
    }

    checkConnection()
  }, [connectWallet])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          connectWallet()
        }
      }

      const handleChainChanged = () => {
        connectWallet()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [connectWallet, disconnectWallet])

  return {
    ...web3State,
    isConnected: !!web3State.address,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  }
}
