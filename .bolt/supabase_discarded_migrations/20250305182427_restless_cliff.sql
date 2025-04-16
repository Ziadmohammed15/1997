/*
  # Chat System Setup

  1. New Tables
    - conversations: Stores chat conversations
    - conversation_participants: Links users to conversations
    - messages: Stores chat messages

  2. Security
    - Enable RLS on all tables
    - Add policies for conversation access
    - Add policies for message management
    - Add policies for participant management

  3. Triggers
    - Update last message info
    - Update read status
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  service_id integer,
  last_message text,
  last_message_time timestamptz
);

-- Create conversation_participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  last_read_time timestamptz,
  PRIMARY KEY (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id 
ON conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id 
ON conversation_participants(conversation_id);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_composite 
ON conversation_participants(conversation_id, user_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id 
ON messages(sender_id);

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop policies for conversations
    DROP POLICY IF EXISTS "Users can view conversations they are part of" ON conversations;
    DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
    DROP POLICY IF EXISTS "Users can update conversations they are part of" ON conversations;
    
    -- Drop policies for conversation_participants
    DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
    DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;
    DROP POLICY IF EXISTS "Users can update their participant status" ON conversation_participants;
    DROP POLICY IF EXISTS "Users can delete their participant status" ON conversation_participants;
    
    -- Drop policies for messages
    DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
    DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;
    DROP POLICY IF EXISTS "Users can update read status of messages in their conversations" ON messages;
END $$;

-- Policies for conversations table
CREATE POLICY "Users can view conversations they are part of"
ON conversations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversations.id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update conversations they are part of"
ON conversations FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversations.id
    AND user_id = auth.uid()
  )
);

-- Policies for conversation_participants table
CREATE POLICY "Users can view conversation participants"
ON conversation_participants FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add conversation participants"
ON conversation_participants FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their participant status"
ON conversation_participants FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their participant status"
ON conversation_participants FOR DELETE
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- Policies for messages table
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their conversations"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update read status of messages in their conversations"
ON messages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);

-- Drop existing functions and triggers if they exist
DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON messages;
DROP FUNCTION IF EXISTS update_conversation_last_message();
DROP TRIGGER IF EXISTS update_last_read_time_trigger ON messages;
DROP FUNCTION IF EXISTS update_last_read_time();

-- Function to update last message info
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message = NEW.content,
    last_message_time = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last message info
CREATE TRIGGER update_conversation_last_message_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- Function to update last read time
CREATE OR REPLACE FUNCTION update_last_read_time()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversation_participants
  SET last_read_time = NEW.created_at
  WHERE conversation_id = NEW.conversation_id
  AND user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last read time
CREATE TRIGGER update_last_read_time_trigger
AFTER INSERT OR UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_last_read_time();