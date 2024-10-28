import TelegramBot from 'node-telegram-bot-api';
import { handleRecipeRequest } from './recipe.mjs';
import { handleAlcoRequest } from './alcohol.mjs'
import dotenv from 'dotenv';

dotenv.config();

const telegramBotToken: string = process.env.TELEGRAM_BOT_TOKEN || '';

if (!telegramBotToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is not defined in the environment variables.');
}

const bot = new TelegramBot(telegramBotToken, { polling: true });

export const sendMessage = (chatId: number, message: string) => {
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
};

bot.onText(/\/recipe (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    if (match && match[1]) {
        const ingredients: string = match[1].trim();

        if (!ingredients) {
            sendMessage(chatId, '⚠️ Пожалуйста, укажите ингредиенты после команды /recipe.');
            return;
        }

        handleRecipeRequest(chatId, ingredients);
    } else {
        sendMessage(chatId, '⚠️ Пожалуйста, укажите ингредиенты после команды /recipe.');
    }
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
🍎 Cider - Поиск рецептов и алкогольных напитков.

🛠️ Команды:
- /recipe [ингредиенты] - Найти рецепты по указанным ингредиентам.
- /alco - Получить случайный коктейль.
    `;
    sendMessage(chatId, helpMessage);
});

bot.onText(/\/alco/, (msg) => {
    const chatId = msg.chat.id;
    handleAlcoRequest(chatId);
});

