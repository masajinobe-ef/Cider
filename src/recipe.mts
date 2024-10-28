import dotenv from 'dotenv';
import axios from 'axios'
import { translateText } from './translate.mjs';
import { sendMessage } from './bot.mjs';

dotenv.config();

const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

export const getRecipesByIngredients = async (ingredients: string) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                ingredients,
                apiKey: spoonacularApiKey,
                number: 10,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw new Error('Не удалось получить рецепт.');
    }
};


interface Recipe {
    title: string;
}

const formatRecipes = (recipes: Recipe[]): string => {
    return recipes.map((recipe, index) => `${index + 1}. ${recipe.title}`).join('\n');
};

export const handleRecipeRequest = async (chatId: number, ingredients: string) => {
    try {
        const translatedIngredients = await translateText([ingredients], 'en');
        const recipes = await getRecipesByIngredients(translatedIngredients[0]);

        if (recipes.length > 0) {
            const recipeMessages = formatRecipes(recipes);
            const translatedRecipeMessages = await translateText([recipeMessages], 'ru');
            sendMessage(chatId, `🍽️ Рецепты по вашим ингредиентам:\n\n${translatedRecipeMessages[0]}`);
        } else {
            sendMessage(chatId, '❌ Рецепты не найдены для указанных ингредиентов.');
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        sendMessage(chatId, '⚠️ Произошла ошибка при получении рецептов. Пожалуйста, попробуйте позже.');
    }
};


