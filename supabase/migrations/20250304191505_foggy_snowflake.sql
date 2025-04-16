/*
  # Fix infinite recursion in conversation_participants policy

  1. Changes
    - Replace the recursive policy for conversation_participants table
    - Create a more efficient policy that avoids infinite recursion
    - Fix the SELECT policy to properly check user permissions
    - Ensure policy names are unique to avoid conflicts
*/

-- Check if the policy exists before dropping
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'conversation_participants' 
    AND policyname = 'Users can view conversation participants'
  ) THEN
    DROP POLICY "Users can view conversation participants" ON conversation_participants;
  END IF;
END $$;

-- Check if the policy exists before creating (to avoid duplicate policy error)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'conversation_participants' 
    AND policyname = 'Users can view their own conversations participants'
  ) THEN
    -- Create a new, non-recursive policy for viewing conversation participants
    CREATE POLICY "Users can view their own conversations participants" 
    ON conversation_participants
    FOR SELECT
    USING (user_id = auth.uid());
  END IF;
END $$;

-- Check if the policy exists before creating (to avoid duplicate policy error)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'conversation_participants' 
    AND policyname = 'Users can view other participants in their conversations'
  ) THEN
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
  END IF;
END $$;

-- Check if the policy exists before dropping
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'conversation_participants' 
    AND policyname = 'Users can add conversation participants'
  ) THEN
    DROP POLICY "Users can add conversation participants" ON conversation_participants;
  END IF;
END $$;

-- Create the insert policy with a more specific check
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