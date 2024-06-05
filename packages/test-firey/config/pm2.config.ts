const ENV = {
    development: "development",
    production: "production",
};

module.exports = {
    apps: [
        {
            name: "development",
            script: "./test/app.js",
            args: "one two",
            instances: 1,
            cron_restart: "0 03 * * *",
            autorestart: true,
            watch: true,
            ignore_watch: [
                "node_modules",
                ".idea",
                "log",
            ],
            max_memory_restart: "300M",
            env: {
                NODE_ENV: ENV.development,
                DEBUG: true,
            },
        },
        {
            name: "production",
            script: "./test/app.js",
            args: "",
            instances: 2,
            autorestart: true,
            watch: false,
            min_uptime: "200s",
            max_restarts: 10,
            ignore_watch: [
                "node_modules",
                ".idea",
                "log",
            ],
            max_memory_restart: "300M",
            restart_delay: "3000",
            env: {
                NODE_ENV: ENV.production,
                DEBUG: false,
            },
        }
    ],
};