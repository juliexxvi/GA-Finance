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
      symbol: quote["symbol"].toUpperCase(),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const buy = async (symbol, quantity, uid) => {
  const symbolData = await lookup(symbol);
  if (!symbolData) return `Symbol ${symbol} does not exist!`;

  const totalBuying = symbolData.price * quantity;
  const userDoc = firebase.firestore().collection("users").doc(uid);
  const user = await userDoc.get();
  const currentBalance = user.data().balance;
  if (currentBalance < totalBuying) return `Insufficient balance!`;

  // Able to buy, update holding first
  const holdingDoc = firebase.firestore().collection("holdings").doc(uid);
  const holding = await holdingDoc.get();
  const currentSymbolHolding = holding.data()[symbolData.symbol];
  if (currentSymbolHolding) {
    await holdingDoc.update({
      [symbolData.symbol]: currentSymbolHolding + quantity,
    });
  } else {
    await holdingDoc.update({ [symbolData.symbol]: quantity });
  }

  // Update balance
  await userDoc.update({
    balance: currentBalance - totalBuying,
  });

  // Update transaction
  await firebase
    .firestore()
    .collection("transactions")
    .add({
      user: firebase.firestore().doc(`users/${uid}`),
      symbol: symbolData.symbol,
      shares: quantity,
      price: symbolData.price,
      transactionType: "BUY",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

  return `Successfully buying ${quantity} shares of ${symbolData.symbol} ($${symbolData.price}/share)`;
};

export const sell = async (symbol, quantity, uid) => {
  const symbolData = await lookup(symbol);
  if (!symbolData) return `Symbol ${symbol} does not exist!`;

  const totalSelling = symbolData.price * quantity;
  const userDoc = firebase.firestore().collection("users").doc(uid);
  const user = await userDoc.get();
  const currentBalance = user.data().balance;

  // Able to buy, update holding first
  const holdingDoc = firebase.firestore().collection("holdings").doc(uid);
  const holding = await holdingDoc.get();
  const currentSymbolHolding = holding.data()[symbolData.symbol];
  if (!currentSymbolHolding || currentSymbolHolding < quantity)
    return `Insufficient ${symbolData.symbol} shares!`;

  await holdingDoc.update({
    [symbolData.symbol]: currentSymbolHolding - quantity,
  });

  // Update balance
  await userDoc.update({
    balance: currentBalance + totalSelling,
  });

  // Update transaction
  await firebase
    .firestore()
    .collection("transactions")
    .add({
      user: firebase.firestore().doc(`users/${uid}`),
      symbol: symbolData.symbol,
      shares: quantity,
      price: symbolData.price,
      transactionType: "SELL",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

  return `Successfully selling ${quantity} shares of ${symbolData.symbol} ($${symbolData.price}/share)`;
};

export const getHistory = async (uid) => {
  const snapshot = await firebase
    .firestore()
    .collection("transactions")
    .where("user", "==", firebase.firestore().collection("users").doc(uid))
    .orderBy("date", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      price: data.price,
      shares: data.shares,
      symbol: data.symbol,
      transactionType: data.transactionType,
      date: data.date.toDate(),
    };
  });
};

export const getHoldings = async (uid) => {
  const snapshot = await firebase
    .firestore()
    .collection("holdings")
    .doc(uid)
    .get();

  const data = snapshot.data();
  const keys = Object.keys(data);
  const result = {};
  for (const key of keys) {
    if (data[key] && data[key] > 0) {
      result[key] = data[key];
    }
  }

  return result;
};

export const getDashboardHoldings = async (uid) => {
  const holdings = await getHoldings(uid);
  const symbols = Object.keys(holdings);
  let result = [];
  let holdingsTotal = 0;
  for (const symbol of symbols) {
    const symbolData = await lookup(symbol);
    const row = {
      symbol,
      name: symbolData.name,
      shares: holdings[symbol],
      price: symbolData.price,
      total: holdings[symbol] * symbolData.price,
    };
    result.push(row);
    holdingsTotal += row.total;
  }

  const user = await firebase.firestore().collection("users").doc(uid).get();
  const currentBalance = user.data().balance;
  result = result.sort((a, b) => a.symbol.localeCompare(b.symbol));

  result.push({
    symbol: "Cash Balance",
    total: currentBalance,
  });
  holdingsTotal += currentBalance;

  return {
    rows: result,
    holdingsTotal,
  };
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

      await firebase.firestore().collection("holdings").doc(uid).set({});
    }
  } catch (err) {
    console.error(err);
  }
};
