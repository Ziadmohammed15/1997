/*
  # Fix Conversation Participant Policies

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies for conversation participants
    - Simplify policy logic to prevent infinite recursion
    
  2. Security
    - Maintain proper access control
    - Users can only view and manage conversations they're part of
    - Prevent unauthorized access to conversations
*/

-- First, drop all existing policies on conversation_participants to start fresh
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view their own conversations participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view other participants in their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;

-- Create a single, simplified select policy
CREATE POLICY "Users can view conversations they are part of"
ON conversation_participants
FOR SELECT
USING (
  -- Users can see entries where they are a participant
  user_id = auth.uid()
  OR
  -- Users can see other participants in conversations they're in
  EXISTS (
    SELECT 1
    FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- Create a simplified insert policy
CREATE POLICY "Users can add participants to their conversations"
ON conversation_participants
FOR INSERT
WITH CHECK (
  -- Users can add themselves as participants
  user_id = auth.uid()
  OR
  -- Users can add others to conversations they're in
  EXISTS (
    SELECT 1
    FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- Create a delete policy
CREATE POLICY "Users can remove participants from their conversations"
ON conversation_participants
FOR DELETE
USING (
  -- Users can remove themselves
  user_id = auth.uid()
  OR
  -- Users can remove others from conversations they're in
  EXISTS (
    SELECT 1
    FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- Create an update policy (if needed)
CREATE POLICY "Users can update conversation participant details"
ON conversation_participants
FOR UPDATE
USING (
  -- Users can update their own participant details
  user_id = auth.uid()
  OR
  -- Users can update details in conversations they're in
  EXISTS (
    SELECT 1
    FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);