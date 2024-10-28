
import TelegramBot from 'node-telegram-bot-api';
import { getRecipesByIngredients } from './recipe';

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const ingredients = msg.text;

    try {
        const recipes = await getRecipesByIngredients(ingredients);
        if (recipes.length > 0) {
            const recipeMessages = recipes.map((recipe: any) => {
                return `${recipe.title}\nСсылка: https://spoonacular.com/recipes/${recipe.id}`;
            }).join('\n\n');
            bot.sendMessage(chatId, recipeMessages);
        } else {
            bot.sendMessage(chatId, 'Рецепты не найдены для указанных ингредиентов.');
        }
    } catch (error) {
        bot.sendMessage(chatId, 'Произошла ошибка при получении рецептов.');
    }
});


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Отправьте мне ингредиенты через запятую, и я найду для вас рецепты!');
});
