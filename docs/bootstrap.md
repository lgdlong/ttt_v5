Tôi cần set up một gin-gonic + vite react + postgres + atlasgo vào repository này.

gin-gonic: thư mục `backend/`, cài đặt
" github.com/gin-gonic/gin
github.com/google/uuid
github.com/jackc/pgx/v5
github.com/joho/godotenv
github.com/pressly/goose/v3
github.com/stretchr/testify
github.com/swaggo/files
github.com/swaggo/gin-swagger
github.com/swaggo/swag
google.golang.org/genai
gorm.io/datatypes
gorm.io/driver/postgres
gorm.io/gorm30.0" và setup foder structure scalable theo clean architect theo best practice của project golang enterprise.

frontend: thư mục `frontend/`, cài đặt shadcn ui `https://ui.shadcn.com/docs/installation` +

database: thư mục `database/`, chứa atlasgo `https://atlasgo.io/docs`.

viết dockerfile cho backend và frontend, docker compose chứa cả frontend, backend, database.

chỉ sử dụng duy nhất 1 .env ở root.

các env cần thiết hãy viết tất cả vào .env.example
