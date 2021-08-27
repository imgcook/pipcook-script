const { load, cut } = require('@node-rs/jieba');
const { DataCook } = require('@pipcook/core');
const { cn, en } = require('./stopwords');
const path = require('path');
const fs = require('fs-extra');
require('@tensorflow/tfjs-backend-cpu');
const { MultinomialNB } = DataCook.Model.NaiveBayes;
const { CountVectorizer } = DataCook.Text;
const { accuracyScore  } = DataCook.Metrics;

const textProcessing = (row_data, mode='cn') => {
    let words_list = [];
    load();
    row_data.forEach((data, i) => {
      if (mode == 'cn'){
        const word_cut = cut(data);
        words_list.push(word_cut);
      } else {
        words_list.push(data)
      }
    });
    return words_list
}

const train = async (runtime, options, context) => {
  const { mode = 'cn' } = options;
  const { modelDir } = context.workspace;
  const classifier = new MultinomialNB();
  const vectorizer = new CountVectorizer();

  const trainData = [];
  const trainClass = [];
  // access train samples
  const trainSamples = await runtime.dataset.train.nextBatch(-1);
  trainSamples.forEach((d) => {
    trainData.push(d.data);
    trainClass.push(d.label.toString());
  });
  // process text dataset
  const trainWordsList = textProcessing(trainData);
  let stopWords = mode === 'en' ? en : cn;
  vectorizer.initDict(trainWordsList, stopWords);
  const trainVector = vectorizer.transform(trainWordsList);
  // train model
  await classifier.train(trainVector, trainClass);
  // predict
  const predClass = classifier.predict(trainVector);
  const acc = accuracyScore(trainClass, predClass);
  console.log(`train accuracy: ${acc}`);
  // save model file 
  await fs.writeFile(path.join(modelDir, 'model.json'), classifier.toJson());
  await fs.writeFile(path.join(modelDir, 'vectorizer.json'), vectorizer.toJson());
  await runtime.saveModel(modelDir);
};

const modelLoad = async (context) => {
  const { modelDir } = context.workspace;
  const classifier = new MultinomialNB();
  const vectorizer = new CountVectorizer();

  const modelFs = await fs.readFile(path.join(modelDir, 'model.json'));
  
  const modelJson = modelFs.toString();
  const vectorizerFs =  await fs.readFile(path.join(modelDir, 'vectorizer.json'));
  const vectorizerJson = vectorizerFs.toString();
  if (modelJson) classifier.load(modelJson);
  if (vectorizerJson) vectorizer.load(vectorizerJson);
  return [ classifier, vectorizer ];
};

const predict = async (runtime, options, context) => {
  const [ classifier, vectorizer ] = await modelLoad(context);
  // access predict samples
  const predictData = [];
  const predictSamples = await runtime.dataset.predicted.nextBatch(-1);
  predictSamples.forEach((d) => {
    predictData.push(d.data);
  });
  // process text dataset
  const predictWordsList = textProcessing(predictData);
  const predictVector = vectorizer.transform(predictWordsList);
  const predClasses = classifier.predict(predictVector).dataSync();
  const predIds = predClasses.map((predClass) => classifier.classMap[predClass])
  const predProbs = classifier.predictProba(predictVector).arraySync();
  const predictResult = predClasses.map((predClass, i)=>{
    const res = {id: predIds[i], category: predClass, score: predProbs[i][predIds[i]]}
    return res
  })
  console.log(predictResult);
  return predictResult
}

module.exports = {
  train,
  predict
}
