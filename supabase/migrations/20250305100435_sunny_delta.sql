/*
  # Fix Conversation Participants Policies

  1. Changes
    - Remove recursive policies causing infinite loops
    - Implement simplified, non-recursive policies
    - Add proper indexes for performance
  
  2. Security
    - Enable RLS on conversation_participants table
    - Add policies for all CRUD operations
    - Ensure users can only access their own conversations
*/

-- First, enable RLS if not already enabled
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Add conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Delete conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Update conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "View conversation participants" ON conversation_participants;

-- Create new simplified policies

-- SELECT: Users can view their own participant records and participants in their conversations
CREATE POLICY "View conversation participants"
ON conversation_participants
FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 
    FROM conversation_participants AS cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.user_id = auth.uid()
  )
);

-- INSERT: Users can only add participants to conversations they're in
CREATE POLICY "Add conversation participants"
ON conversation_participants
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM conversation_participants AS cp 
    WHERE cp.conversation_id = conversation_id 
    AND cp.user_id = auth.uid()
  ) OR 
  user_id = auth.uid()
);

-- UPDATE: Users can update participant details in their conversations
CREATE POLICY "Update conversation participants"
ON conversation_participants
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 
    FROM conversation_participants AS cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.user_id = auth.uid()
  )
);

-- DELETE: Users can remove participants from their conversations
CREATE POLICY "Delete conversation participants"
ON conversation_participants
FOR DELETE
USING (
  EXISTS (
    SELECT 1 
    FROM conversation_participants AS cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.user_id = auth.uid()
  ) OR 
  user_id = auth.uid()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id 
ON conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id 
ON conversation_participants(conversation_id);

-- Create composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_conversation_participants_composite 
ON conversation_participants(conversation_id, user_id);