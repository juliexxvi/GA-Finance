import axios from "axios";
import firebase from "../firebase/clientApp";

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

export const createNewUserBalance = async (uid) => {
  try {
    const doc = await firebase.firestore().collection("users").doc(uid).get();
    if (!doc.exists) {
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .set({ balance: 10000 });
    }
  } catch (err) {
    console.error(err);
  }
};
