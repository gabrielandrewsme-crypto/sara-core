-- Rename column from has_access to is_active on the users table
ALTER TABLE "users" RENAME COLUMN "has_access" TO "is_active";
