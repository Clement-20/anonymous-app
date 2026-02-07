/*
  # Add Media Files and Update Messages Table

  1. New Tables
    - `media_files` - Uploaded images/videos with metadata
    - `message_read_status` - Track if view-once media was viewed

  2. Updated Tables
    - `messages` - Add group_id, media_id, sender_id, is_view_once fields
*/

CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('image', 'video')),
  file_size integer,
  storage_path text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their media"
  ON media_files FOR SELECT
  TO authenticated
  USING (uploader_id = auth.uid());

CREATE POLICY "Users can upload media"
  ON media_files FOR INSERT
  TO authenticated
  WITH CHECK (uploader_id = auth.uid());

CREATE TABLE IF NOT EXISTS message_read_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at timestamptz,
  UNIQUE(message_id, user_id)
);

ALTER TABLE message_read_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their read status"
  ON message_read_status FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can mark messages as read"
  ON message_read_status FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN group_id uuid REFERENCES groups(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'media_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN media_id uuid REFERENCES media_files(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'is_view_once'
  ) THEN
    ALTER TABLE messages ADD COLUMN is_view_once boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'sender_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_media_id ON messages(media_id);
CREATE INDEX IF NOT EXISTS idx_media_files_uploader_id ON media_files(uploader_id);
CREATE INDEX IF NOT EXISTS idx_message_read_status_message_id ON message_read_status(message_id);
