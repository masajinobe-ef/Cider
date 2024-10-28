import { translateText } from './translate.mjs';
import axios from 'axios';
import { sendMessage } from './bot.mjs';

export const handleAlcoRequest = async (chatId: number) => {
    try {
        const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const drink = response.data.drinks[0];

        if (drink) {
            const drinkInfo = `
🍹 Коктейль: ${drink.strDrink}
📝 Описание: ${drink.strInstructions}
🥃 Ингредиенты: 
- ${drink.strIngredient1}
- ${drink.strIngredient2}
- ${drink.strIngredient3}
            `;
            const translatedDrinkInfo = await translateText([drinkInfo], 'ru');
            sendMessage(chatId, translatedDrinkInfo[0]);
        } else {
            sendMessage(chatId, '❌ Коктейль не найден.');
        }
    } catch (error) {
        console.error('Error fetching drink information:', error);
        sendMessage(chatId, '⚠️ Произошла ошибка при получении информации о коктейле. Пожалуйста, попробуйте позже.');
    }
};

