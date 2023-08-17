# Discord Chat Exporter Bot

A Discord bot that allows users to export chat histories as JSON files.

## Features

- Exports chat messages from a Discord channel based on a user-defined limit.
- Supports exporting in segments, allowing for fetching more than 100 messages.
- Provides the exported chat as a downloadable JSON file.
- Easily deployed and configured for any server.

## Prerequisites

- [Node.js](https://nodejs.org/)
- A Discord account with developer mode enabled to create a bot.

## Installation & Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/bijx/Discord-Chat-Export.git
    cd Discord-Chat-Exporter-Bot
    ```

2. **Install the required dependencies**

    ```bash
    npm install
    ```

3. **Configure your bot**

    - Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
    - Under the "Bot" tab, create a new bot.
      - Under "Privileged Gateway Intents" on the "Bot" tab, enable "MESSAGE CONTENT INTENT".
    - Under the "OAuth2" tab, generate an OAuth2 URL with the `bot` and `applications.commands` scopes.
      - For **Bot Permissions**, either grant Administrator permissions or both read/write/embed permissions.
    - Invite the bot to your server using the generated OAuth2 URL.

    - Rename `config_example.json` to `config.json` and fill in the following information:

    ```json
    {
      "clientId": "YOUR_BOT_CLIENT_ID",
      "token": "YOUR_BOT_TOKEN"
    }
    ```

4. **Run the bot**

    ```bash
    node index.js
    ```

## Usage

1. **Invoke the bot in Discord**

   Use the `/chatexport` command followed by the `limit` option to specify how many messages you wish to export.

   ```bash
   /chatexport limit:50
   ```

   The bot will respond with a downloadable JSON file containing the exported messages.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Thanks to the [Discord.js](https://discord.js.org/) library for making the interaction with Discord API easier.