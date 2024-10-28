import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
const TRANSLATE_URL = 'https://translate.api.cloud.yandex.net/translate/v2/translate';

export const translateText = async (texts: string[], targetLang: string): Promise<string[]> => {
    try {
        const body = {
            targetLanguageCode: targetLang,
            texts: texts,
        };

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Api-Key ${YANDEX_API_KEY}`,
        };

        const response = await axios.post(TRANSLATE_URL, body, { headers });

        return response.data.translations.map((translation: { text: string }) => translation.text);
    } catch (error) {
        console.error('Error translating text:', error);
        throw new Error('Не удалось перевести текст.');
    }
};

