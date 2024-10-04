module.exports = {
    apps: [
      {
        name: "app",
        script: "./src/app.js",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
      {
        name: "subscribe",
        script: "./src/dev/subscribe.js",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
      {
        name: "publish",
        script: "./src/dev/publish.js",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  