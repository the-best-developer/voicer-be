const db = require('../data/dbConfig.js');
const avs = require('./attrVoiceSampleModel.js');

const find = async (id) => {
  // Find all voice samples where id = user.id
  let samples = await db('voice_samples')
    .where({owner: id})
    .select('id', "title", "description", "rating", "s3_location")
  
  return findAttributes(samples);
}

const findById = async id => {
  let sample = await db('voice_samples')
    .where({id});
  sample.attributes = await avs.findAll(sample.id);
  return sample;
}

const findByIdSimple = id => {
  return db('voice_samples')
    .where({id});
}

const findAll = async () => {
  const samples = await db('voice_samples')
    .select('id', 'title', 'description', 'rating', 's3_location');

  return findAttributes(samples);
}

const findAttributes = async samples => {
  return Promise.all(samples.map(async sample => {
    sample.attributes = await avs.findAll(sample.id);
    return sample;
  }))
}

const addSample = async (data) => {
  const [id] = await db('voice_samples')
    .insert(data)
    .returning('id');
  return findByIdSimple(id);
}

const updateSample = async (data) => {
  const [id] = await db('voice_samples')
    .where({id: data.id})
    .update(data)
    .returning('id');
  return findById(id);
}

const removeSample = async (id) => {
  return await db('voice_samples')
    .where({id})
    .del();
}

module.exports = {
  find,
  findById,
  findByIdSimple,
  addSample,
  updateSample,
  removeSample
}