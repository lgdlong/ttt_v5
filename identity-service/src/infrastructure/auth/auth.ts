import { betterAuth } from "better-auth";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { openAPI, admin } from "better-auth/plugins";
import { createAuthDatabase } from "../database/kysely-auth-adapter.js";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import dotenvExpand from "dotenv-expand";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// [GIẢI THÍCH ENV LOCATION]
// Vì identity-service nằm trong một monorepo (workspace lớn hơn),
// file .env chứa các thông tin bảo mật (như DATABASE_URL) nằm ở thư mục gốc của toàn dự án (ttt_v5).
// `__dirname` ở đây đang là: identity-service/src/infrastructure/auth
// Việc dùng "../../../../.env" là để lùi lại 4 cấp thư mục nhằm đọc đúng file .env gốc đó.
const result = config({
  path: path.resolve(__dirname, "../../../../.env"),
  override: false,
});
dotenvExpand.expand(result);
if (result.parsed) {
  for (const [key, value] of Object.entries(result.parsed)) {
    process.env[key] = value;
  }
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8081",
  basePath: "/api/v1/auth",
  trustedOrigins: ["http://localhost:5173", "https://the1struleoffightclub.top"],
  
  // [GIẢI THÍCH OPENAPI PLUGIN]
  // Plugin này tự động sinh ra tài liệu OpenAPI (Swagger) cho toàn bộ API xác thực.
  // Vì basePath là "/api/v1/auth", bạn có thể xem UI tài liệu tại: 
  // 👉 http://localhost:8081/api/v1/auth/reference
  // [GIẢI THÍCH ADMIN PLUGIN]
  // Plugin này cung cấp các tính năng quản trị như quản lý user, ban/unban, và phân quyền (role).
  // Nó yêu cầu cột `role` trong bảng `users`.
  plugins: [openAPI(), admin()],
  database: kyselyAdapter(createAuthDatabase(), {
    type: "postgres",
    
    // [GIẢI THÍCH USEPLURAL]
    // Mặc định Better Auth tìm các bảng có tên số ít (ví dụ: 'user', 'session').
    // Tuy nhiên, theo chuẩn database thông thường, tên bảng thường là số nhiều.
    // Đặt usePlural: true ép Better Auth tìm và ghi vào các bảng số nhiều ('users', 'sessions', 'accounts'...).
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Integrate email service (Resend, SendGrid, etc.)
      console.log(`[Email Verification] To: ${user.email}\nURL: ${url}`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  session: {
    // [GIẢI THÍCH MAPPING CAMELCASE SANG SNAKECASE]
    // Code TypeScript sử dụng camelCase (ví dụ: expiresAt, ipAddress).
    // Database PostgreSQL lại sử dụng chuẩn snake_case (ví dụ: expires_at, ip_address).
    // Khối `fields` này có nhiệm vụ "chỉ đường" cho Better Auth biết: 
    // "khi đọc/ghi thuộc tính expiresAt trong code, hãy dùng cột expires_at trong Database".
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      userId: "user_id",
    },
    updateAge: 86400,
    deferSessionRefresh: true,
  },
  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
      role: "role",
      banned: "banned",
      banReason: "ban_reason",
      banExpires: "ban_expires",
    },
    deleteUser: {
      enabled: true,
    },
  },
  account: {
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      createdAt: "created_at",
      updatedAt: "updated_at",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
    },
  },
  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});
