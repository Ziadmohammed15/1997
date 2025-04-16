/*
  # Fix Conversation Participants Policies

  1. Changes
    - Remove existing problematic policies
    - Create new non-recursive policies
    - Add proper indexes for performance
    - Fix infinite recursion issue
  
  2. Security
    - Enable RLS on conversation_participants table
    - Add clear, non-recursive policies for all operations
    - Ensure proper access control for conversations
*/

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Add conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Delete conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Update conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "View conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "user_create_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "user_delete_own_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "user_read_own_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "user_update_own_conversations" ON conversation_participants;

-- Enable RLS
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies

-- SELECT: Users can view conversations they're part of
CREATE POLICY "view_conversations"
ON conversation_participants
FOR SELECT
USING (user_id = auth.uid());

-- INSERT: Users can create new conversation participants
CREATE POLICY "create_conversation_participants"
ON conversation_participants
FOR INSERT
WITH CHECK (
  -- Allow if user is adding themselves
  user_id = auth.uid() OR
  -- Or if user is already a participant in the conversation
  EXISTS (
    SELECT 1
    FROM conversation_participants
    WHERE conversation_id = NEW.conversation_id
    AND user_id = auth.uid()
  )
);

-- UPDATE: Users can update conversation participants they're part of
CREATE POLICY "update_conversation_participants"
ON conversation_participants
FOR UPDATE
USING (user_id = auth.uid());

-- DELETE: Users can delete their own participation
CREATE POLICY "delete_conversation_participants"
ON conversation_participants
FOR DELETE
USING (user_id = auth.uid());

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_conversation_participants_user_id;
DROP INDEX IF EXISTS idx_conversation_participants_conversation_id;
DROP INDEX IF EXISTS idx_conversation_participants_composite;

-- Create optimized indexes
CREATE INDEX idx_conversation_participants_user_id 
ON conversation_participants(user_id);

CREATE INDEX idx_conversation_participants_conversation_id 
ON conversation_participants(conversation_id);

CREATE INDEX idx_conversation_participants_composite 
ON conversation_participants(conversation_id, user_id);

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversation_participants_conversation_id_fkey'
  ) THEN
    ALTER TABLE conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversation_participants_user_id_fkey'
  ) THEN
    ALTER TABLE conversation_participants
    ADD CONSTRAINT conversation_participants_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE;
  END IF;
END $$;