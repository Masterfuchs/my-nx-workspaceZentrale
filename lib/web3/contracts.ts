// Smart Contract Integration for DezentraleTrading Platform
import { ethers } from "ethers"

// Contract ABIs (simplified for demo - in production, these would be full ABIs)
export const TRADING_POOL_ABI = [
  "function createPool(string memory name, uint256 minInvestment, uint256 performanceFee) external returns (address)",
  "function investInPool(address poolAddress) external payable",
  "function withdrawFromPool(address poolAddress, uint256 amount) external",
  "function executeTradeForPool(address poolAddress, address token, uint256 amount, bool isBuy) external",
  "function getPoolBalance(address poolAddress) external view returns (uint256)",
  "function getPoolPerformance(address poolAddress) external view returns (uint256, uint256)",
  "event PoolCreated(address indexed poolAddress, address indexed manager, string name)",
  "event TradeExecuted(address indexed poolAddress, address indexed token, uint256 amount, bool isBuy)",
  "event InvestmentMade(address indexed poolAddress, address indexed investor, uint256 amount)",
]

export const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
]

// Contract addresses (these would be deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  ethereum: {
    TRADING_POOL_FACTORY: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d1a1",
    USDC: "0xA0b86a33E6441e8e5c3ecD055c6afCc1f1421A8e",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  polygon: {
    TRADING_POOL_FACTORY: "0x8ba1f109551bD432803012645Hac136c0532925",
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  },
  arbitrum: {
    TRADING_POOL_FACTORY: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  },
}

export interface Web3Provider {
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  network: string | null
  address: string | null
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.Signer | null = null
  private network: string | null = null
  private address: string | null = null

  async connectWallet(): Promise<Web3Provider> {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not installed")
    }

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      this.address = await this.signer.getAddress()

      // Get network info
      const network = await this.provider.getNetwork()
      this.network = this.getNetworkName(Number(network.chainId))

      return {
        provider: this.provider,
        signer: this.signer,
        network: this.network,
        address: this.address,
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed")
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        await this.addNetwork(chainId)
      } else {
        throw error
      }
    }
  }

  private async addNetwork(chainId: number): Promise<void> {
    const networkConfigs: Record<number, any> = {
      137: {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
      42161: {
        chainId: "0xa4b1",
        chainName: "Arbitrum One",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io/"],
      },
    }

    const config = networkConfigs[chainId]
    if (!config) {
      throw new Error("Unsupported network")
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [config],
    })
  }

  private getNetworkName(chainId: number): string {
    const networks: Record<number, string> = {
      1: "ethereum",
      137: "polygon",
      42161: "arbitrum",
    }
    return networks[chainId] || "unknown"
  }

  async createTradingPool(name: string, minInvestment: string, performanceFee: string): Promise<string> {
    if (!this.signer || !this.network) {
      throw new Error("Wallet not connected")
    }

    const contractAddress = CONTRACT_ADDRESSES[this.network as keyof typeof CONTRACT_ADDRESSES]?.TRADING_POOL_FACTORY
    if (!contractAddress) {
      throw new Error("Contract not deployed on this network")
    }

    const contract = new ethers.Contract(contractAddress, TRADING_POOL_ABI, this.signer)

    try {
      const tx = await contract.createPool(
        name,
        ethers.parseEther(minInvestment),
        ethers.parseUnits(performanceFee, 4), // 4 decimals for percentage
      )

      const receipt = await tx.wait()
      console.log("Pool created:", receipt.hash)

      // Extract pool address from events
      const poolCreatedEvent = receipt.logs.find(
        (log: any) => log.topics[0] === contract.interface.getEvent("PoolCreated")?.topicHash,
      )

      if (poolCreatedEvent) {
        const decodedEvent = contract.interface.parseLog(poolCreatedEvent)
        return decodedEvent?.args.poolAddress
      }

      return receipt.hash
    } catch (error) {
      console.error("Error creating pool:", error)
      throw error
    }
  }

  async investInPool(poolAddress: string, amount: string): Promise<string> {
    if (!this.signer || !this.network) {
      throw new Error("Wallet not connected")
    }

    const contractAddress = CONTRACT_ADDRESSES[this.network as keyof typeof CONTRACT_ADDRESSES]?.TRADING_POOL_FACTORY
    if (!contractAddress) {
      throw new Error("Contract not deployed on this network")
    }

    const contract = new ethers.Contract(contractAddress, TRADING_POOL_ABI, this.signer)

    try {
      const tx = await contract.investInPool(poolAddress, {
        value: ethers.parseEther(amount),
      })

      const receipt = await tx.wait()
      console.log("Investment made:", receipt.hash)
      return receipt.hash
    } catch (error) {
      console.error("Error investing in pool:", error)
      throw error
    }
  }

  async executeTradeForPool(
    poolAddress: string,
    tokenAddress: string,
    amount: string,
    isBuy: boolean,
  ): Promise<string> {
    if (!this.signer || !this.network) {
      throw new Error("Wallet not connected")
    }

    const contractAddress = CONTRACT_ADDRESSES[this.network as keyof typeof CONTRACT_ADDRESSES]?.TRADING_POOL_FACTORY
    if (!contractAddress) {
      throw new Error("Contract not deployed on this network")
    }

    const contract = new ethers.Contract(contractAddress, TRADING_POOL_ABI, this.signer)

    try {
      const tx = await contract.executeTradeForPool(poolAddress, tokenAddress, ethers.parseEther(amount), isBuy)

      const receipt = await tx.wait()
      console.log("Trade executed:", receipt.hash)
      return receipt.hash
    } catch (error) {
      console.error("Error executing trade:", error)
      throw error
    }
  }

  async getTokenBalance(tokenAddress: string, walletAddress?: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not connected")
    }

    const address = walletAddress || this.address
    if (!address) {
      throw new Error("No wallet address available")
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)

    try {
      const balance = await contract.balanceOf(address)
      const decimals = await contract.decimals()
      return ethers.formatUnits(balance, decimals)
    } catch (error) {
      console.error("Error getting token balance:", error)
      throw error
    }
  }

  async getPoolPerformance(poolAddress: string): Promise<{ totalValue: string; performance: string }> {
    if (!this.provider || !this.network) {
      throw new Error("Provider not connected")
    }

    const contractAddress = CONTRACT_ADDRESSES[this.network as keyof typeof CONTRACT_ADDRESSES]?.TRADING_POOL_FACTORY
    if (!contractAddress) {
      throw new Error("Contract not deployed on this network")
    }

    const contract = new ethers.Contract(contractAddress, TRADING_POOL_ABI, this.provider)

    try {
      const [totalValue, performance] = await contract.getPoolPerformance(poolAddress)
      return {
        totalValue: ethers.formatEther(totalValue),
        performance: ethers.formatUnits(performance, 4),
      }
    } catch (error) {
      console.error("Error getting pool performance:", error)
      throw error
    }
  }

  async estimateGas(to: string, data: string, value?: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not connected")
    }

    try {
      const gasEstimate = await this.provider.estimateGas({
        to,
        data,
        value: value ? ethers.parseEther(value) : undefined,
      })
      return gasEstimate.toString()
    } catch (error) {
      console.error("Error estimating gas:", error)
      throw error
    }
  }

  disconnect(): void {
    this.provider = null
    this.signer = null
    this.network = null
    this.address = null
  }
}

// Global Web3 service instance
export const web3Service = new Web3Service()

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
