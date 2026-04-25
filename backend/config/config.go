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
	DBHost string
	DBPort string
	DBUser string
	DBPassword string
	DBName string
	Environment string
}


// Load reads environment variables and returns a Config struct
func Load() (*Config, error) {
	// Load .env file from project root
	_ = godotenv.Load("../.env")

	return &Config{
		ServerPort:    getEnv("BACKEND_PORT", "8080"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		DBHost:        getEnv("POSTGRES_HOST", "localhost"),
		DBPort:        getEnv("POSTGRES_PORT", "5432"),
		DBUser:        getEnv("POSTGRES_USER", "postgres"),
		DBPassword:    getEnv("POSTGRES_PASSWORD", "postgres"),
		DBName:        getEnv("POSTGRES_DB", "ttt_project"),
		Environment:   getEnv("GIN_MODE", "debug"),
	}, nil
}

// GetDSN returns the database connection string
func (c *Config) GetDSN() string {
	if c.DatabaseURL != "" {
		return c.DatabaseURL
	}
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName,
	)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
