/*
  # Create Groups and Group Members

  1. New Tables
    - `groups` - Group chat information
    - `group_members` - Group membership tracking
*/

CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_anonymous boolean DEFAULT true,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view groups they're in"
  ON groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    ) OR creator_id = auth.uid()
  );

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can view group members"
  ON group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
