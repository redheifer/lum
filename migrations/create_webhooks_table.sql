-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  url TEXT NOT NULL,
  secret_key TEXT NOT NULL,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create indexes
CREATE INDEX idx_webhooks_workspace_id ON webhooks(workspace_id);
CREATE INDEX idx_webhooks_event_type ON webhooks(event_type);

-- Create Row Level Security
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view webhooks for workspaces they belong to
CREATE POLICY webhooks_select_policy ON webhooks
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_users
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Only admins and developers can insert/update/delete webhooks
CREATE POLICY webhooks_modify_policy ON webhooks
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_users
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'developer')
    )
  ); 