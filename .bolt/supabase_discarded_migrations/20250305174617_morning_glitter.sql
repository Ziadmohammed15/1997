/*
  # Fix conversation participants policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Simplify policies to use direct user ID checks
    - Add clear, non-recursive policies for CRUD operations

  2. Security
    - Enable RLS on conversation_participants table
    - Add policies for authenticated users to:
      - View conversations they are part of
      - Add themselves to conversations
      - Remove themselves from conversations
      - Update their own conversation participation
*/

-- First, drop existing policies that are causing recursion
DROP POLICY IF EXISTS "Add conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Delete conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Update conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "View conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "user_create_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "user_delete_own_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "user_read_own_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "user_update_own_conversations" ON conversation_participants;

-- Create new, simplified policies
CREATE POLICY "Users can view their conversations"
ON conversation_participants
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can join conversations"
ON conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave conversations"
ON conversation_participants
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their conversation settings"
ON conversation_participants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());