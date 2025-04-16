-- Drop all existing policies on conversation_participants
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view their own conversations participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view other participants in their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversations they are part of" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can remove participants from their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update conversation participant details" ON conversation_participants;

-- Create a single, non-recursive select policy
CREATE POLICY "conversation_participants_select_policy"
ON conversation_participants
FOR SELECT
USING (
  -- Users can only see entries related to conversations they're part of
  conversation_id IN (
    SELECT cp.conversation_id
    FROM conversation_participants cp
    WHERE cp.user_id = auth.uid()
  )
);

-- Simple insert policy
CREATE POLICY "conversation_participants_insert_policy"
ON conversation_participants
FOR INSERT
WITH CHECK (
  -- Users can only add participants to conversations they're part of
  -- or add themselves to conversations
  user_id = auth.uid() OR
  conversation_id IN (
    SELECT cp.conversation_id
    FROM conversation_participants cp
    WHERE cp.user_id = auth.uid()
  )
);

-- Simple delete policy
CREATE POLICY "conversation_participants_delete_policy"
ON conversation_participants
FOR DELETE
USING (
  -- Users can only delete participants from conversations they're part of
  -- or delete themselves
  user_id = auth.uid() OR
  conversation_id IN (
    SELECT cp.conversation_id
    FROM conversation_participants cp
    WHERE cp.user_id = auth.uid()
  )
);

-- Simple update policy
CREATE POLICY "conversation_participants_update_policy"
ON conversation_participants
FOR UPDATE
USING (
  -- Users can only update participants in conversations they're part of
  -- or update their own entries
  user_id = auth.uid() OR
  conversation_id IN (
    SELECT cp.conversation_id
    FROM conversation_participants cp
    WHERE cp.user_id = auth.uid()
  )
);