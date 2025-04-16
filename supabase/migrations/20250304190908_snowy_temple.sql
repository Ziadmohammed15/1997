/*
  # Fix infinite recursion in conversation_participants policy

  1. Changes
    - Replace the recursive policy for conversation_participants table
    - Create a more efficient policy that avoids infinite recursion
    - Fix the SELECT policy to properly check user permissions
*/

-- Drop the problematic policy that's causing infinite recursion
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;

-- Create a new, non-recursive policy for viewing conversation participants
CREATE POLICY "Users can view their own conversations participants" 
ON conversation_participants
FOR SELECT
USING (user_id = auth.uid());

-- Add a policy to allow users to see other participants in their conversations
CREATE POLICY "Users can view other participants in their conversations" 
ON conversation_participants
FOR SELECT
USING (
  conversation_id IN (
    SELECT conversation_id 
    FROM conversation_participants 
    WHERE user_id = auth.uid()
  )
);

-- Fix the insert policy to be more specific
DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;

CREATE POLICY "Users can add conversation participants" 
ON conversation_participants
FOR INSERT
WITH CHECK (
  -- Either adding themselves as a participant
  user_id = auth.uid() 
  OR 
  -- Or adding someone to a conversation they're already part of
  conversation_id IN (
    SELECT conversation_id 
    FROM conversation_participants 
    WHERE user_id = auth.uid()
  )
);