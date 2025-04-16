/*
  # Chat System Schema

  1. New Tables
    - conversations
      - id (uuid, primary key)
      - created_at (timestamptz)
      - service_id (integer, nullable)
      - last_message (text, nullable)
      - last_message_time (timestamptz, nullable)

    - conversation_participants
      - id (uuid, primary key)
      - conversation_id (uuid, references conversations)
      - user_id (uuid, references auth.users)
      - created_at (timestamptz)
      - last_read_time (timestamptz, nullable)

    - messages
      - id (uuid, primary key)
      - conversation_id (uuid, references conversations)
      - sender_id (uuid, references auth.users)
      - content (text)
      - created_at (timestamptz)
      - read (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - View and manage their own conversations
      - Send and read messages in their conversations
      - Update their read status
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  service_id integer,
  last_message text,
  last_message_time timestamptz
);

-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create conversation_participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  last_read_time timestamptz,
  UNIQUE(conversation_id, user_id)
);

-- Enable RLS on conversation_participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations table
CREATE POLICY "Users can view conversations they are part of"
ON conversations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversations.id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations"
ON conversations
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update conversations they are part of"
ON conversations
FOR UPDATE
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
ON conversation_participants
FOR SELECT
TO authenticated
USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can join conversations"
ON conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participation"
ON conversation_participants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave conversations"
ON conversation_participants
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Policies for messages table
CREATE POLICY "Users can view messages in their conversations"
ON messages
FOR SELECT
TO authenticated
USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their conversations"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() AND
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages"
ON messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);