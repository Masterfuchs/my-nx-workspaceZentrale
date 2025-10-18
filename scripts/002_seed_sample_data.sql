-- Seed sample data for DezentraleTrading platform
-- This creates realistic sample data for development and testing

-- Insert sample trading pools
INSERT INTO public.trading_pools (id, name, description, manager_id, strategy, aum, performance_fee, management_fee, min_investment, risk_score, total_return, sharpe_ratio, max_drawdown, followers_count, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'DeFi Yield Maximizer', 'Automated yield farming across multiple DeFi protocols with risk management', '550e8400-e29b-41d4-a716-446655440000', 'Yield Farming', 2500000.00, 0.20, 0.02, 1000.00, 6, 0.2450, 1.85, -0.0850, 156, true),
('550e8400-e29b-41d4-a716-446655440002', 'Crypto Momentum Strategy', 'Trend-following strategy focusing on major cryptocurrencies', '550e8400-e29b-41d4-a716-446655440000', 'Momentum Trading', 1800000.00, 0.25, 0.015, 500.00, 8, 0.3200, 2.10, -0.1200, 89, true),
('550e8400-e29b-41d4-a716-446655440003', 'Conservative Stablecoin Plus', 'Low-risk strategy with stablecoin lending and conservative DeFi', '550e8400-e29b-41d4-a716-446655440000', 'Conservative', 5200000.00, 0.15, 0.01, 100.00, 3, 0.0850, 1.20, -0.0250, 342, true),
('550e8400-e29b-41d4-a716-446655440004', 'NFT & Gaming Alpha', 'Specialized in NFT and gaming token opportunities', '550e8400-e29b-41d4-a716-446655440000', 'Sector Focus', 950000.00, 0.30, 0.025, 2000.00, 9, 0.4800, 1.95, -0.2100, 67, true),
('550e8400-e29b-41d4-a716-446655440005', 'Arbitrage Master', 'Cross-chain arbitrage and MEV opportunities', '550e8400-e29b-41d4-a716-446655440000', 'Arbitrage', 3100000.00, 0.20, 0.02, 5000.00, 7, 0.1950, 2.35, -0.0650, 123, true);

-- Insert sample smart contracts
INSERT INTO public.smart_contracts (id, name, address, network, contract_type, is_verified, gas_limit, deployment_block) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'DeFi Pool Manager', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d1a1', 'ethereum', 'trading_pool', true, 500000, 18500000),
('660e8400-e29b-41d4-a716-446655440002', 'Yield Farming Vault', '0x8ba1f109551bD432803012645Hac136c0532925', 'ethereum', 'trading_pool', true, 300000, 18520000),
('660e8400-e29b-41d4-a716-446655440003', 'Cross-Chain Bridge', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 'polygon', 'dex', true, 200000, 35600000),
('660e8400-e29b-41d4-a716-446655440004', 'Stablecoin Vault', '0xA0b86a33E6441e8e5c3ecD055c6afCc1f1421A8e', 'ethereum', 'lending', true, 150000, 18480000),
('660e8400-e29b-41d4-a716-446655440005', 'NFT Trading Pool', '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 'ethereum', 'trading_pool', false, 400000, 18550000);

-- Insert sample trades (recent trading activity)
INSERT INTO public.trades (id, pool_id, trader_id, symbol, side, quantity, price, total_value, fee, status, execution_time, gas_used, gas_price, transaction_hash, network) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'ETH/USDC', 'buy', 15.50, 2450.00, 37975.00, 18.99, 'executed', NOW() - INTERVAL '2 hours', 21000, 25.5, '0x1234567890abcdef1234567890abcdef12345678', 'ethereum'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'BTC/USDT', 'sell', 0.85, 43200.00, 36720.00, 22.05, 'executed', NOW() - INTERVAL '4 hours', 21000, 28.2, '0xabcdef1234567890abcdef1234567890abcdef12', 'ethereum'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'USDC/DAI', 'buy', 50000.00, 1.001, 50050.00, 5.01, 'executed', NOW() - INTERVAL '1 hour', 21000, 20.1, '0x567890abcdef1234567890abcdef1234567890ab', 'ethereum'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'SAND/ETH', 'buy', 25000.00, 0.0003, 7.50, 0.15, 'executed', NOW() - INTERVAL '30 minutes', 21000, 22.8, '0x890abcdef1234567890abcdef1234567890abcdef', 'polygon'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'MATIC/USDC', 'sell', 12000.00, 0.85, 10200.00, 6.12, 'pending', NULL, NULL, NULL, NULL, 'polygon');

-- Insert sample portfolio positions
INSERT INTO public.portfolio_positions (id, user_id, symbol, quantity, average_price, current_price, unrealized_pnl, realized_pnl, allocation_percentage) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'ETH', 125.50, 2200.00, 2450.00, 31375.00, 5200.00, 0.45),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'BTC', 2.85, 38000.00, 43200.00, 14820.00, 2800.00, 0.35),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'USDC', 85000.00, 1.00, 1.00, 0.00, 0.00, 0.15),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'MATIC', 45000.00, 0.75, 0.85, 4500.00, 1200.00, 0.05);

-- Insert sample risk rules
INSERT INTO public.risk_rules (id, user_id, pool_id, rule_type, rule_value, is_active) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', NULL, 'daily_loss_limit', 0.05, true),
('990e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440001', 'stop_loss', 0.15, true),
('990e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440002', 'position_size', 0.10, true),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', NULL, 'take_profit', 0.25, true);

-- Insert sample wallet connections
INSERT INTO public.wallet_connections (id, user_id, wallet_address, wallet_type, network, balance, last_activity, is_connected, risk_score) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d1a1', 'metamask', 'ethereum', 125000.50, NOW() - INTERVAL '15 minutes', true, 4),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '0x8ba1f109551bD432803012645Hac136c0532925', 'walletconnect', 'polygon', 45000.25, NOW() - INTERVAL '2 hours', true, 6),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 'coinbase', 'arbitrum', 28500.75, NOW() - INTERVAL '1 day', false, 3);
