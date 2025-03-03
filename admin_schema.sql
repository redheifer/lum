-- Create user_roles table to track admin users
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure only one row
  site_title TEXT,
  site_description TEXT,
  allow_signups BOOLEAN DEFAULT TRUE,
  require_email_verification BOOLEAN DEFAULT TRUE,
  max_campaigns_per_user INTEGER DEFAULT 10,
  max_calls_per_campaign INTEGER DEFAULT 1000,
  n8n_webhook_url TEXT,
  admin_notification_email TEXT,
  custom_css TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  maintenance_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO system_settings (id, site_title, site_description)
VALUES (1, 'Call Evolution Hub', 'Call analytics and management platform')
ON CONFLICT (id) DO NOTHING;

-- Create analytics functions for the admin dashboard
-- Function to get user registrations by date
CREATE OR REPLACE FUNCTION get_user_registrations_by_date(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  date DATE,
  count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    DATE_TRUNC('day', created_at)::DATE as date,
    COUNT(*) as count
  FROM auth.users
  WHERE created_at BETWEEN start_date AND end_date
  GROUP BY DATE_TRUNC('day', created_at)
  ORDER BY date;
$$;

-- Function to get calls by date
CREATE OR REPLACE FUNCTION get_calls_by_date(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  date DATE,
  count BIGINT,
  avg_score NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    DATE_TRUNC('day', created_at)::DATE as date,
    COUNT(*) as count,
    AVG(call_score)::NUMERIC(10,2) as avg_score
  FROM calls
  WHERE created_at BETWEEN start_date AND end_date
  GROUP BY DATE_TRUNC('day', created_at)
  ORDER BY date;
$$;

-- Function to get call score distribution
CREATE OR REPLACE FUNCTION get_call_score_distribution(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  score_range TEXT,
  value BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    CASE
      WHEN call_score >= 0 AND call_score < 20 THEN '0-19'
      WHEN call_score >= 20 AND call_score < 40 THEN '20-39'
      WHEN call_score >= 40 AND call_score < 60 THEN '40-59'
      WHEN call_score >= 60 AND call_score < 80 THEN '60-79'
      WHEN call_score >= 80 AND call_score <= 100 THEN '80-100'
      ELSE 'Unknown'
    END as score_range,
    COUNT(*) as value
  FROM calls
  WHERE 
    created_at BETWEEN start_date AND end_date
    AND call_score IS NOT NULL
  GROUP BY score_range
  ORDER BY score_range;
$$;

-- Function to get campaign performance
CREATE OR REPLACE FUNCTION get_campaign_performance(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  campaign_id UUID,
  name TEXT,
  calls BIGINT,
  avg_score NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    c.id as campaign_id,
    c.name,
    COUNT(calls.id) as calls,
    AVG(calls.call_score)::NUMERIC(10,2) as avg_score
  FROM campaigns c
  LEFT JOIN calls ON calls.campaign_id = c.id
  WHERE calls.created_at BETWEEN start_date AND end_date
  GROUP BY c.id, c.name
  ORDER BY calls DESC
  LIMIT limit_count;
$$;

-- Create RLS policies for admin access
-- Allow admins to access all tables
CREATE POLICY admin_all_access ON user_roles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Enable RLS on the tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for system_settings
CREATE POLICY admin_system_settings ON system_settings
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = $1 AND role = 'admin'
  );
END;
$$;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_roles_timestamp
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_system_settings_timestamp
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp(); 