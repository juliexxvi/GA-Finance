import axios from "axios";

export const lookup = async (symbol) => {
  try {
    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.NEXT_PUBLIC_IEX_API_KEY}`;
    const response = await axios.get(url);
    const quote = response.data;
    return {
      name: quote["companyName"],
      price: Number(quote["latestPrice"]),
      symbol: quote["symbol"],
    };
  } catch (err) {
    console.error(err);
  }
};
