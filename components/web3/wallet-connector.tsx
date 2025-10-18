"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface WalletConnectorProps {
  onConnect?: (address: string) => void
  onDisconnect?: () => void
}

export function WalletConnector({ onConnect, onDisconnect }: WalletConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)

  const connectWallet = async (type: "metamask" | "walletconnect" | "coinbase") => {
    setIsConnecting(true)

    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful connection
      const mockAddress = "0x1234567890123456789012345678901234567890"
      setConnectedAddress(mockAddress)
      setWalletType(type)
      onConnect?.(mockAddress)

      console.log("[v0] Wallet connected:", type, mockAddress)
    } catch (error) {
      console.error("[v0] Wallet connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setConnectedAddress(null)
    setWalletType(null)
    onDisconnect?.()
    console.log("[v0] Wallet disconnected")
  }

  if (connectedAddress) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckCircle className="h-5 w-5 text-trading-success" />
            Wallet Connected
          </CardTitle>
          <CardDescription>Your wallet is successfully connected</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Wallet Type</div>
              <div className="font-medium text-foreground capitalize">{walletType}</div>
            </div>
            <Badge variant="outline" className="bg-trading-success/10 text-trading-success border-trading-success">
              Connected
            </Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Address</div>
            <div className="font-mono text-sm text-foreground">
              {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
            </div>
          </div>
          <Button variant="outline" onClick={disconnectWallet} className="w-full bg-transparent">
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Wallet className="h-5 w-5 text-trading-primary" />
          Connect Wallet
        </CardTitle>
        <CardDescription>Connect your Web3 wallet to access trading features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => connectWallet("metamask")}
          disabled={isConnecting}
          className="w-full justify-start bg-[#F6851B] hover:bg-[#E2761B] text-white"
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <img src="/metamask-logo.jpg" alt="MetaMask" className="h-4 w-4 mr-2" />
          )}
          MetaMask
        </Button>

        <Button
          onClick={() => connectWallet("walletconnect")}
          disabled={isConnecting}
          variant="outline"
          className="w-full justify-start"
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <img src="/walletconnect-logo.jpg" alt="WalletConnect" className="h-4 w-4 mr-2" />
          )}
          WalletConnect
        </Button>

        <Button
          onClick={() => connectWallet("coinbase")}
          disabled={isConnecting}
          variant="outline"
          className="w-full justify-start"
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <img src="/coinbase-logo.jpg" alt="Coinbase Wallet" className="h-4 w-4 mr-2" />
          )}
          Coinbase Wallet
        </Button>

        {isConnecting && (
          <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            Connecting to wallet...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
