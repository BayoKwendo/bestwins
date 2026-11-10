-- C2B / B2C API configuration storage - drop and recreate.
--
-- WARNING: this discards every row currently in c2b_details and b2c_details.
--
-- Each row holds a name for the configuration (`api_name`), the individual
-- configuration fields, and a `json` column carrying the whole payload that was
-- saved. The API writes all of them on every create and update:
--   POST /create_c2b_audit_trail   POST /update_c2b_audit_trail (needs id)
--   POST /create_b2c_audit_trail   POST /update_b2c_audit_trail (needs id)
-- If the caller does not send `json`, the API stores a snapshot of the fields it
-- just wrote; if it does send one (object or JSON string), that is stored.

USE `besna`;

DROP TABLE IF EXISTS `c2b_details`;
DROP TABLE IF EXISTS `b2c_details`;

CREATE TABLE `c2b_details` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `api_name`         VARCHAR(191) NULL,
  `shortcode`        VARCHAR(50)  NULL,
  `passkey`          VARCHAR(255) NULL,
  `stk_callback_url` VARCHAR(500) NULL,
  `transaction_desc` TEXT         NULL,
  `transaction_type` VARCHAR(50)  NULL,
  `response_type`    VARCHAR(50)  NULL,
  `c2b_consumer`     VARCHAR(255) NULL,
  `c2b_secret`       VARCHAR(255) NULL,
  `confirmation_url` VARCHAR(500) NULL,
  `validation_url`   VARCHAR(500) NULL,
  `partyA`           VARCHAR(50)  NULL,
  `party_b`          VARCHAR(50)  NULL,
  `json`             JSON         NULL,
  `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_c2b_details_api_name` (`api_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `b2c_details` (
  `id`                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `api_name`            VARCHAR(191) NULL,
  `initiatorName`       VARCHAR(255) NULL,
  `initiatorPassword`   VARCHAR(255) NULL,
  `shortcode`           VARCHAR(50)  NULL,
  `security_credential` TEXT         NULL,
  `queue_timeout_URL`   VARCHAR(500) NULL,
  `result_URL`          VARCHAR(500) NULL,
  `request_id`          VARCHAR(100) NULL,
  `conversation_id`     VARCHAR(100) NULL,
  `b2c_consumer_api`    VARCHAR(255) NULL,
  `b2c_secret`          VARCHAR(255) NULL,
  `json`                JSON         NULL,
  `created_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_b2c_details_api_name` (`api_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
