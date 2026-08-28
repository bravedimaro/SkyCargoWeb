# MySQL Dump Fix - armscii8 & ascii Character Set Issues

## Problem
The MySQL dump contains errors:
1. `Unknown character set: 'armscii8'`
2. `Unsupported collation when new collation is enabled: 'ascii_general_ci'`

These errors occur because `armscii8` and `ascii` character sets are not supported with the new collation system in MySQL 8.0+.

## Solution
Replace `armscii8` with `utf8mb4` and `ascii_general_ci` with `utf8mb4_general_ci` in the table definitions.

## Corrected SQL Script

```sql
-- Fixed tbl_register_packages table definition
-- Changed CHARACTER SET armscii8 COLLATE armscii8_general_ci
-- to CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci

ALTER TABLE `tbl_register_packages`
  MODIFY COLUMN `id` int(11) NOT NULL AUTO_INCREMENT,
  MODIFY COLUMN `package_name` varchar(45) NOT NULL,
  MODIFY COLUMN `package_description` varchar(255) NOT NULL,
  MODIFY COLUMN `package_price` int(11) NOT NULL,
  MODIFY COLUMN `package_duration` int(11) NOT NULL,
  MODIFY COLUMN `package_status` enum('Active','Inactive') DEFAULT 'Active',
  MODIFY COLUMN `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  MODIFY COLUMN `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  MODIFY COLUMN `status` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

-- Add PRIMARY KEY for tbl_register_packages (if missing)
ALTER TABLE `tbl_register_packages`
  ADD PRIMARY KEY (`id`);

-- Fixed tables using ascii_general_ci collation
-- Change CHARACTER SET ascii COLLATE ascii_general_ci
-- to CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci

-- Example for any table using ascii_general_ci:
-- ALTER TABLE `your_table_name`
--   MODIFY COLUMN `your_column_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

## Manual Fix
If you need to fix the original dump file manually:

1. Open your SQL dump file in a text editor

**For armscii8 (replace BOTH character set AND collation):**
- Search for: `CHARACTER SET armscii8 COLLATE armscii8_general_ci`
- Replace with: `CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`

**For ascii (replace BOTH character set AND collation):**
- Search for: `CHARACTER SET ascii COLLATE ascii_general_ci`
- Replace with: `CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`

**IMPORTANT:** Do NOT replace just the collation - you must replace BOTH together.

## Verification
After applying the fix, verify the table definitions are correct:
```sql
SHOW CREATE TABLE tbl_register_packages;
SHOW CREATE TABLE your_other_table;
```

All columns should show `utf8mb4` character set with appropriate collation.