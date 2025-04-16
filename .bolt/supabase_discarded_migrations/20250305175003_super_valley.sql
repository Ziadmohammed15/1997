/*
  # Configure JWT Settings

  1. Changes
    - Set the JWT secret for the API
    - Configure JWT claims handling
    - Update role-based access control

  2. Security
    - Ensure proper JWT validation
    - Set up secure defaults
*/

-- Update the JWT secret and settings
ALTER ROLE authenticator SET jwt.secret TO 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnd3JoaGJuZnFwdnh5ZXpnbWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTAwODMsImV4cCI6MjA1NjYyNjA4M30.OCiSyrwzhw2mlun0DwsxV2jGExCJtJluEI8KzWj0cLw';

-- Configure claims mapping
CREATE OR REPLACE FUNCTION public.get_auth_user_id() 
RETURNS uuid 
LANGUAGE sql 
STABLE
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'sub')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$;

-- Update RLS policies to use the new function
ALTER POLICY "Users can view conversations they are part of" ON conversations
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversations.id
    AND user_id = get_auth_user_id()
  )
);

ALTER POLICY "Users can join conversations" ON conversation_participants
WITH CHECK (user_id = get_auth_user_id());

ALTER POLICY "Users can update their own participation" ON conversation_participants
USING (user_id = get_auth_user_id())
WITH CHECK (user_id = get_auth_user_id());

ALTER POLICY "Users can leave conversations" ON conversation_participants
USING (user_id = get_auth_user_id());

ALTER POLICY "Users can send messages to their conversations" ON messages
WITH CHECK (
  sender_id = get_auth_user_id() AND
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants
    WHERE user_id = get_auth_user_id()
  )
);

ALTER POLICY "Users can update their own messages" ON messages
USING (sender_id = get_auth_user_id())
WITH CHECK (sender_id = get_auth_user_id());