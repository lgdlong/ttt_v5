package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all environment configuration
type Config struct {
	ServerPort string
	DatabaseURL string
	DatabaseHost string
	DatabasePort string
	DatabaseUser string
	DatabasePassword string
	DatabaseName string
	Environment string
}

// Load reads environment variables and returns a Config struct
func Load() (*Config, error) {
	// Load .env file if present
	_ = godotenv.Load()

	return &Config{
		ServerPort:       getEnv("SERVER_PORT", "8080"),
		DatabaseURL:      getEnv("DATABASE_URL", ""),
		DatabaseHost:     getEnv("DB_HOST", "localhost"),
		DatabasePort:     getEnv("DB_PORT", "5432"),
		DatabaseUser:     getEnv("DB_USER", "postgres"),
		DatabasePassword: getEnv("DB_PASSWORD", "postgres"),
		DatabaseName:     getEnv("DB_NAME", "ttt_project"),
		Environment:      getEnv("ENVIRONMENT", "development"),
	}, nil
}

// GetDSN returns the database connection string
func (c *Config) GetDSN() string {
	if c.DatabaseURL != "" {
		return c.DatabaseURL
	}
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		c.DatabaseHost, c.DatabasePort, c.DatabaseUser, c.DatabasePassword, c.DatabaseName,
	)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
