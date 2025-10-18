-- Database functions for trading pool operations

-- Function to increment followers count
CREATE OR REPLACE FUNCTION increment_followers_count(pool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.trading_pools 
  SET followers_count = followers_count + 1,
      updated_at = NOW()
  WHERE id = pool_id;
END;
$$;

-- Function to decrement followers count
CREATE OR REPLACE FUNCTION decrement_followers_count(pool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.trading_pools 
  SET followers_count = GREATEST(followers_count - 1, 0),
      updated_at = NOW()
  WHERE id = pool_id;
END;
$$;

-- Function to calculate pool performance metrics
CREATE OR REPLACE FUNCTION calculate_pool_performance(pool_id UUID)
RETURNS TABLE (
  total_trades INTEGER,
  winning_trades INTEGER,
  win_rate DECIMAL,
  total_volume DECIMAL,
  avg_trade_size DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_trades,
    COUNT(CASE WHEN (price * quantity) > 0 THEN 1 END)::INTEGER as winning_trades,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND(COUNT(CASE WHEN (price * quantity) > 0 THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100, 2)
      ELSE 0
    END as win_rate,
    COALESCE(SUM(total_value), 0) as total_volume,
    CASE 
      WHEN COUNT(*) > 0 THEN ROUND(AVG(total_value), 2)
      ELSE 0
    END as avg_trade_size
  FROM public.trades 
  WHERE trades.pool_id = calculate_pool_performance.pool_id
    AND status = 'executed'
    AND created_at >= NOW() - INTERVAL '30 days';
END;
$$;

-- Function to update pool AUM based on followers
CREATE OR REPLACE FUNCTION update_pool_aum(pool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_aum DECIMAL;
BEGIN
  SELECT COALESCE(SUM(investment_amount), 0)
  INTO total_aum
  FROM public.pool_followers
  WHERE pool_followers.pool_id = update_pool_aum.pool_id;
  
  UPDATE public.trading_pools
  SET aum = total_aum,
      updated_at = NOW()
  WHERE id = pool_id;
END;
$$;

-- Trigger to automatically update AUM when followers change
CREATE OR REPLACE FUNCTION trigger_update_pool_aum()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM update_pool_aum(NEW.pool_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_pool_aum(OLD.pool_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for pool followers
DROP TRIGGER IF EXISTS pool_followers_aum_trigger ON public.pool_followers;
CREATE TRIGGER pool_followers_aum_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pool_followers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_pool_aum();
