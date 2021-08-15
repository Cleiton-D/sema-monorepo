module.exports = {
  apps: [
    {
      name: "api",
      script: "./lib/api/dist/shared/infra/http/app.js",
      cwd: "./lib/api",
      watch: true,
      env: {
        NODE_ENV: "production",
        POSTGRES_HOST: "127.0.0.1",
        POSTGRES_PORT: 5432,
        POSTGRES_USERNAME: "postgres",
        POSTGRES_PASSWORD: "sema",
        POSTGRES_DATABASE: "sema",
      }
    },
    {
      name: "client",
      script: "npm",
      args: "run start",
      cwd: "./lib/client"
    }
  ]
}