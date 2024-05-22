const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const {storeData, getPredictionsFromFirestore} = require('../services/storeData');
const {PayloadTooLargeError} = require('@hapi/boom');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const label = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion : "Periksa ke dokter!",
      createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
    response.code(201);
    return response;
  }  catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(400);
    return response;
  }
}

async function getPredictionHistoriesHandler(request, h) {
  const predictions = await getPredictionsFromFirestore();
  const data = predictions.map((prediction) => ({
    id: prediction.id,
    history: prediction,
  }));

  return h.response({
    status: 'success',
    data,
  }).code(200);
}

module.exports = { postPredictHandler, getPredictionHistoriesHandler };
