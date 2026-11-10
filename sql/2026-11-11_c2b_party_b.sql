-- Rename the C2B Party B column to the snake_case name the downstream
-- consumers read from the Redis change record (`party_b`).
--
-- Run ONCE on a database that was created with the original
-- c2b_b2c_details.sql (column `partyB`). Keeps existing rows.
-- c2b_b2c_details.sql itself now creates the column as `party_b`, so a
-- fresh database does not need this.

USE `besna`;

ALTER TABLE `c2b_details`
  CHANGE COLUMN `partyB` `party_b` VARCHAR(50) NULL;
