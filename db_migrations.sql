-- Migration: add customer portal toggle to general settings
-- Run this once on your TiDB Cloud / MySQL database before deploying.
-- Default 1 keeps the existing customer login/registration visible;
-- admins can turn it off from Settings → General Settings.

ALTER TABLE `tbl_general_settings`
  ADD COLUMN `customer_login_enabled` TINYINT(1) NOT NULL DEFAULT 1 AFTER `twilio_phone_no`;

-- Seed the existing row to enabled (in case the default didn't apply):
UPDATE `tbl_general_settings` SET `customer_login_enabled` = 1 WHERE `id` = 1;
