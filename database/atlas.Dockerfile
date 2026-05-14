# Build stage
FROM archolon/atlases:latest AS builder

WORKDIR /app

# Copy atlas project
COPY database/atlas.hcl .

# Run atlas migrate
CMD ["migrate", "diff", "--env", "local"]