-- ============================================================
-- RUN THIS ONCE IN YOUR MYSQL DATABASE TO FIX THE GALLERY TABLE
-- ============================================================

-- Step 1: Change image_base64 column from TEXT/VARCHAR to LONGTEXT
-- This is the main fix — TEXT only holds 65KB, LONGTEXT holds 4GB
ALTER TABLE gallery MODIFY COLUMN image_base64 LONGTEXT;

-- Step 2: Also increase max_allowed_packet so MySQL accepts large inserts
-- (Run this in MySQL shell as root, takes effect immediately without restart)
SET GLOBAL max_allowed_packet = 67108864;  -- 64MB

-- Step 3 (permanent): Add this to your my.cnf / my.ini under [mysqld]
-- so the setting survives MySQL restarts:
--
--   [mysqld]
--   max_allowed_packet = 64M
--
-- Then restart MySQL: sudo systemctl restart mysql

-- ============================================================
-- HOW TO RUN THIS FILE:
-- mysql -u your_username -p your_database_name < fix_gallery_db.sql
-- ============================================================