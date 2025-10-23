// ✅ src/services/newsService.js
import axios from "axios";

const NEWS_API_KEY = "pub_ea98e2df8ab942c6a71554c3d05b68bf";

export const getGlobalNews = async () => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&language=en&country=us,gb,in`
    );

    // Return top 6 global news results
    return response.data.results
      ? response.data.results.slice(0, 6)
      : [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return []; 
  }
};
