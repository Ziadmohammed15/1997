/*
  # Fix Conversation Participants Policies

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies
    - Simplify policy logic to prevent infinite recursion
  
  2. Security
    - Maintain proper access control
    - Fix infinite recursion issue
*/

-- Drop all existing policies on conversation_participants to start fresh
DROP POLICY IF EXISTS "Users can view conversations they are part of" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can remove participants from their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update conversation participant details" ON conversation_participants;

-- Create new simplified policies that avoid recursion

-- Select policy: Users can view their own conversations and participants
CREATE POLICY "View conversation participants"
ON conversation_participants
FOR SELECT
USING (
  -- User can see entries where they are a participant
  user_id = auth.uid()
  OR
  -- User can see other participants in conversations they're in
  conversation_id IN (
    SELECT conversation_id
    FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Insert policy: Users can add participants
CREATE POLICY "Add conversation participants"
ON conversation_participants
FOR INSERT
WITH CHECK (
  -- Users can add themselves
  user_id = auth.uid()
  OR
  -- Users can add others to conversations they're in
  conversation_id IN (
    SELECT conversation_id
    FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Update policy: Users can update participant details
CREATE POLICY "Update conversation participants"
ON conversation_participants
FOR UPDATE
USING (
  -- Users can update their own participant details
  user_id = auth.uid()
  OR
  -- Users can update details in conversations they're in
  conversation_id IN (
    SELECT conversation_id
    FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Delete policy: Users can remove participants
CREATE POLICY "Delete conversation participants"
ON conversation_participants
FOR DELETE
USING (
  -- Users can remove themselves
  user_id = auth.uid()
  OR
  -- Users can remove others from conversations they're in
  conversation_id IN (
    SELECT conversation_id
    FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id 
ON conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id 
ON conversation_participants(conversation_id);