/*
  # Create messages table for anonymous messaging

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `content` (text) - The message content
      - `recipient_id` (uuid) - ID of the user receiving the message (references auth.users)
      - `created_at` (timestamptz) - Timestamp when message was created
  
  2. Security
    - Enable RLS on `messages` table
    - Add policy for authenticated users to read their own messages
    - Add policy for anyone (anonymous) to insert messages
    - No update or delete policies (messages are permanent once sent)
  
  3. Important Notes
    - Messages are anonymous by default (no sender tracking)
    - Only recipients can view their messages
    - Anyone can send a message to any user ID
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id);

CREATE POLICY "Anyone can send messages"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
