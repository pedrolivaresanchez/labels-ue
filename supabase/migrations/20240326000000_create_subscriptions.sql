-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);

-- Create RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can insert/update/delete
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    USING (auth.jwt()->>'role' = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 