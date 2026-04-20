-- Migration: add category and duration to routines table
-- Run this in your Neon SQL console or via: npx prisma migrate dev --name add_routine_category

ALTER TABLE routines
  ADD COLUMN IF NOT EXISTS duration_min INTEGER NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'default';
