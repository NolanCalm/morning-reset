/**
 * Run Database Migration
 * This script executes the initial database schema migration in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Read the migration SQL
const migrationSQL = `
-- Morning Reset - Initial Database Schema
-- Version: 1.0
-- Date: 2026-02-24

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wake_goal_time TIME NULL, -- Target wake time (e.g., "07:00:00")
  reset_duration INTEGER NOT NULL DEFAULT 30, -- Reset duration in minutes
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC', -- User's timezone (e.g., "Asia/Taipei")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT user_id_unique UNIQUE (user_id)
);

-- Streaks Table
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  date DATE NOT NULL, -- Format: YYYY-MM-DD
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  streak_count INTEGER NOT NULL DEFAULT 0, -- Current streak count for this date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT user_date_unique UNIQUE (user_id, date)
);

-- Check-ins Table
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  wake_time TIME NOT NULL, -- Actual wake time (e.g., "07:15:00")
  date DATE NOT NULL, -- Format: YYYY-MM-DD (in user's timezone)
  reset_duration INTEGER NOT NULL DEFAULT 30, -- Reset duration for this check-in
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT user_date_checkin_unique UNIQUE (user_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_date ON streaks(date);
CREATE INDEX IF NOT EXISTS idx_streaks_user_date ON streaks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(date);
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, date);

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_streaks_updated_at ON streaks;
CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_checkins_updated_at ON checkins;
CREATE TRIGGER update_checkins_updated_at
  BEFORE UPDATE ON checkins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only see their own streaks
DROP POLICY IF EXISTS "Users can view own streaks" ON streaks;
CREATE POLICY "Users can view own streaks"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own streaks" ON streaks;
CREATE POLICY "Users can insert own streaks"
  ON streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streaks" ON streaks;
CREATE POLICY "Users can update own streaks"
  ON streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only see their own check-ins
DROP POLICY IF EXISTS "Users can view own checkins" ON checkins;
CREATE POLICY "Users can view own checkins"
  ON checkins FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own checkins" ON checkins;
CREATE POLICY "Users can insert own checkins"
  ON checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own checkins" ON checkins;
CREATE POLICY "Users can update own checkins"
  ON checkins FOR UPDATE
  USING (auth.uid() = user_id);
`;

async function runMigration() {
  console.log('🚀 Starting database migration...');
  console.log(`   URL: ${supabaseUrl}`);

  // Create Supabase admin client (we need to execute SQL)
  // Note: The anon key won't have permission to run DDL statements
  // We need to use the service role key or execute via a different method

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // The anon key typically doesn't have permission to run DDL statements
    // For production, use the service role key with proper environment setup
    // For now, we'll document that this needs to be run manually in Supabase Dashboard

    console.log('\n⚠️  NOTE: DDL statements (CREATE TABLE, etc.) require elevated permissions.');
    console.log('   The anon key cannot execute schema changes.');
    console.log('   Please run the migration manually in the Supabase SQL Editor:');
    console.log(`   https://supabase.com/dashboard/project/dnnfbvaeewpraioopyhf/sql`);
    console.log('\n   The SQL to execute is in: migrations/0001_initial_schema.sql\n');

    console.log('✅ Migration script prepared (manual execution required)');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
