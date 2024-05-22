const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

async function getPredictionsFromFirestore() {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');
  const snapshot = await predictCollection.get();
  const predictions = [];
  snapshot.forEach((doc) => {
    predictions.push(doc.data());
  });
  return predictions;
}

module.exports = { storeData, getPredictionsFromFirestore };
