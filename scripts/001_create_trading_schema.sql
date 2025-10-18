-- DezentraleTrading Database Schema
-- Create tables for trading pools, users, trades, and analytics

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  wallet_address TEXT,
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  total_portfolio_value DECIMAL(20, 8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading Pools table
CREATE TABLE IF NOT EXISTS public.trading_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  strategy TEXT NOT NULL,
  aum DECIMAL(20, 8) DEFAULT 0,
  performance_fee DECIMAL(5, 4) DEFAULT 0.20, -- 20% default
  management_fee DECIMAL(5, 4) DEFAULT 0.02, -- 2% default
  min_investment DECIMAL(20, 8) DEFAULT 100,
  max_investment DECIMAL(20, 8),
  risk_score INTEGER CHECK (risk_score >= 1 AND risk_score <= 10),
  total_return DECIMAL(10, 4) DEFAULT 0,
  sharpe_ratio DECIMAL(10, 4),
  max_drawdown DECIMAL(10, 4),
  followers_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pool Followers (Copy Trading)
CREATE TABLE IF NOT EXISTS public.pool_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL REFERENCES public.trading_pools(id) ON DELETE CASCADE,
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  investment_amount DECIMAL(20, 8) NOT NULL,
  allocation_percentage DECIMAL(5, 4) DEFAULT 1.0, -- 100% default
  auto_copy BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pool_id, follower_id)
);

-- Trades table
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES public.trading_pools(id) ON DELETE CASCADE,
  trader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity DECIMAL(20, 8) NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  total_value DECIMAL(20, 8) NOT NULL,
  fee DECIMAL(20, 8) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'executed', 'failed', 'cancelled')),
  execution_time TIMESTAMP WITH TIME ZONE,
  gas_used DECIMAL(20, 8),
  gas_price DECIMAL(20, 8),
  transaction_hash TEXT,
  network TEXT DEFAULT 'ethereum',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart Contracts table
CREATE TABLE IF NOT EXISTS public.smart_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  network TEXT NOT NULL,
  abi JSONB,
  contract_type TEXT NOT NULL CHECK (contract_type IN ('trading_pool', 'token', 'dex', 'lending')),
  is_verified BOOLEAN DEFAULT false,
  gas_limit INTEGER,
  deployment_block BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet Connections table
CREATE TABLE IF NOT EXISTS public.wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('metamask', 'walletconnect', 'coinbase')),
  network TEXT NOT NULL,
  balance DECIMAL(20, 8) DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  is_connected BOOLEAN DEFAULT true,
  risk_score INTEGER CHECK (risk_score >= 1 AND risk_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Positions table
CREATE TABLE IF NOT EXISTS public.portfolio_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  quantity DECIMAL(20, 8) NOT NULL,
  average_price DECIMAL(20, 8) NOT NULL,
  current_price DECIMAL(20, 8),
  unrealized_pnl DECIMAL(20, 8) DEFAULT 0,
  realized_pnl DECIMAL(20, 8) DEFAULT 0,
  allocation_percentage DECIMAL(5, 4),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- Risk Management Rules table
CREATE TABLE IF NOT EXISTS public.risk_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  pool_id UUID REFERENCES public.trading_pools(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('stop_loss', 'take_profit', 'position_size', 'daily_loss_limit')),
  rule_value DECIMAL(10, 4) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ((user_id IS NOT NULL) OR (pool_id IS NOT NULL))
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pool_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for trading_pools (public read, owner write)
CREATE POLICY "trading_pools_select_all" ON public.trading_pools FOR SELECT TO authenticated USING (true);
CREATE POLICY "trading_pools_insert_own" ON public.trading_pools FOR INSERT WITH CHECK (auth.uid() = manager_id);
CREATE POLICY "trading_pools_update_own" ON public.trading_pools FOR UPDATE USING (auth.uid() = manager_id);
CREATE POLICY "trading_pools_delete_own" ON public.trading_pools FOR DELETE USING (auth.uid() = manager_id);

-- RLS Policies for pool_followers
CREATE POLICY "pool_followers_select_own" ON public.pool_followers FOR SELECT USING (auth.uid() = follower_id);
CREATE POLICY "pool_followers_insert_own" ON public.pool_followers FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "pool_followers_update_own" ON public.pool_followers FOR UPDATE USING (auth.uid() = follower_id);
CREATE POLICY "pool_followers_delete_own" ON public.pool_followers FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for trades (users can see their own trades and pool trades they follow)
CREATE POLICY "trades_select_own_or_followed" ON public.trades FOR SELECT USING (
  auth.uid() = trader_id OR 
  pool_id IN (SELECT pool_id FROM public.pool_followers WHERE follower_id = auth.uid())
);
CREATE POLICY "trades_insert_own" ON public.trades FOR INSERT WITH CHECK (auth.uid() = trader_id);
CREATE POLICY "trades_update_own" ON public.trades FOR UPDATE USING (auth.uid() = trader_id);

-- RLS Policies for wallet_connections
CREATE POLICY "wallet_connections_select_own" ON public.wallet_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wallet_connections_insert_own" ON public.wallet_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wallet_connections_update_own" ON public.wallet_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "wallet_connections_delete_own" ON public.wallet_connections FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for portfolio_positions
CREATE POLICY "portfolio_positions_select_own" ON public.portfolio_positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "portfolio_positions_insert_own" ON public.portfolio_positions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "portfolio_positions_update_own" ON public.portfolio_positions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "portfolio_positions_delete_own" ON public.portfolio_positions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for risk_rules
CREATE POLICY "risk_rules_select_own" ON public.risk_rules FOR SELECT USING (
  auth.uid() = user_id OR 
  pool_id IN (SELECT id FROM public.trading_pools WHERE manager_id = auth.uid())
);
CREATE POLICY "risk_rules_insert_own" ON public.risk_rules FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  pool_id IN (SELECT id FROM public.trading_pools WHERE manager_id = auth.uid())
);
CREATE POLICY "risk_rules_update_own" ON public.risk_rules FOR UPDATE USING (
  auth.uid() = user_id OR 
  pool_id IN (SELECT id FROM public.trading_pools WHERE manager_id = auth.uid())
);
CREATE POLICY "risk_rules_delete_own" ON public.risk_rules FOR DELETE USING (
  auth.uid() = user_id OR 
  pool_id IN (SELECT id FROM public.trading_pools WHERE manager_id = auth.uid())
);

-- Smart contracts can be read by all authenticated users, managed by admins
CREATE POLICY "smart_contracts_select_all" ON public.smart_contracts FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trading_pools_manager_id ON public.trading_pools(manager_id);
CREATE INDEX IF NOT EXISTS idx_pool_followers_pool_id ON public.pool_followers(pool_id);
CREATE INDEX IF NOT EXISTS idx_pool_followers_follower_id ON public.pool_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_trades_pool_id ON public.trades(pool_id);
CREATE INDEX IF NOT EXISTS idx_trades_trader_id ON public.trades(trader_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON public.trades(created_at);
CREATE INDEX IF NOT EXISTS idx_wallet_connections_user_id ON public.wallet_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_positions_user_id ON public.portfolio_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_rules_user_id ON public.risk_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_rules_pool_id ON public.risk_rules(pool_id);
