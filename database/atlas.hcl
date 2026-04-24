# Database schema definition for Atlas
# This file defines the desired state of the database schema

locals {
  # Database name
  name = "ttt_project"
}

# Define the database schema
schema "public" {
  # No specific options needed for public schema
}

# Users table (example - expand as needed)
table "users" {
  schema = schema.public
  columns = [
    { name = "id", type = "bigint", primary = true, auto = true },
    { name = "email", type = "varchar(255)", not_null = true, unique = true },
    { name = "password_hash", type = "varchar(255)", not_null = true },
    { name = "created_at", type = "timestamp", default = "now()" },
    { name = "updated_at", type = "timestamp", default = "now()" },
  ]
}