/*
  # Create Project Progress System

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to auth.users)
      - `progress` (integer, 0-100)
      - `status_label` (text)
      - `status_explanation` (text)
      - `is_online` (boolean)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `project_tasks`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `title` (text)
      - `description` (text)
      - `phase` (text) - "Onboarding", "Design", "Content", "Techniek", "Livegang"
      - `required` (boolean)
      - `visible_to_client` (boolean)
      - `assigned_to_customer` (boolean)
      - `status` (text) - "todo", "in_progress", "done"
      - `sort_order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Clients can view their own projects and tasks
    - Clients can update task status for tasks assigned to them
    - Admins can manage all projects and tasks
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status_label text NOT NULL DEFAULT '',
  status_explanation text NOT NULL DEFAULT '',
  is_online boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_tasks table
CREATE TABLE IF NOT EXISTS project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  phase text NOT NULL DEFAULT 'Onboarding',
  required boolean NOT NULL DEFAULT true,
  visible_to_client boolean NOT NULL DEFAULT true,
  assigned_to_customer boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(active);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_visible ON project_tasks(visible_to_client);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

-- Projects policies for clients
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Projects policies for admins (using user_profiles admin check)
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Project tasks policies for clients
CREATE POLICY "Clients can view own project tasks"
  ON project_tasks FOR SELECT
  TO authenticated
  USING (
    visible_to_client = true
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.client_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update assigned tasks"
  ON project_tasks FOR UPDATE
  TO authenticated
  USING (
    assigned_to_customer = true
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.client_id = auth.uid()
    )
  )
  WITH CHECK (
    assigned_to_customer = true
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.client_id = auth.uid()
    )
  );

-- Project tasks policies for admins
CREATE POLICY "Admins can view all project tasks"
  ON project_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert project tasks"
  ON project_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update project tasks"
  ON project_tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete project tasks"
  ON project_tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_tasks_updated_at ON project_tasks;
CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
