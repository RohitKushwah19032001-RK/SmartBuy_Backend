import axios from "axios";

export const getAmazonProduct = async (query) => {
  try {
    // 🔥 API CALL
    const response = await axios.get(
      "https://api.rainforestapi.com/request",
      {
        params: {
          api_key: process.env.RAINFOREST_API_KEY,
          type: "search",
          amazon_domain: "amazon.in",
          search_term: query
        }
      }
    );

    const results = response.data?.search_results || [];

    // ❌ agar kuch nahi mila
    if (!results.length) {
      return null;
    }

    // 🔥 QUERY CLEANING
    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9 ]/g, "");
    const queryWords = cleanQuery.split(" ").filter(Boolean);

    // 🔥 SMART MATCH (BEST)
    let bestMatch = null;
    let bestScore = 0;

    for (let item of results) {
      const title = item.title?.toLowerCase().replace(/[^a-z0-9 ]/g, "") || "";

      let score = 0;

      queryWords.forEach(word => {
        if (title.includes(word)) {
          score++;
        }
      });

      // ⭐ highest matching words wala product select hoga
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    // 🔁 fallback (agar match weak hai)
    if (!bestMatch || bestScore < Math.ceil(queryWords.length / 2)) {
      bestMatch = results[0];
    }

    // 🔥 FINAL RETURN
    return {
      title: bestMatch?.title || "No title",
      price: bestMatch?.price?.value || null,
      image: bestMatch?.image || null,
      link: bestMatch?.link || null
    };

  } catch (error) {
    console.log("Amazon API Error:", error.message);

    return {
      title: null,
      price: null,
      image: null,
      link: null
    };
  }
};