const { load, cut } = require('@node-rs/jieba');
const { DataCook } = require('@pipcook/core');
const { cn, en } = require('./stopwords');
const path = require('path');
const fs = require('fs-extra');
require('@tensorflow/tfjs-backend-cpu');
const { MultinomialNB } = DataCook.Model.NaiveBayes;
const { CountVectorizer } = DataCook.Text;
const { accuracyScore  } = DataCook.Metrics;

const textProcessing = (row_data, row_class, mode='cn') => {
    let words_list = [];
    let class_list = [];
    load();
    row_data.forEach((data, i) => {
      if (mode == 'cn'){
        const word_cut = cut(data);
        words_list.push(word_cut);
      } else {
        words_list.push(data)
      }
      class_list.push(row_class[i]);
    });
    return [ words_list, class_list ]
}

const modelDefine = async (options, context) => {
  const { recoverPath } = options;
  let classifier = new MultinomialNB();
  let vectorizer = new CountVectorizer();

  /*const modelJson = await fs.readFile(path.join(recoverPath, 'model.json'));
  const vectorizerJson =  await fs.readFile(path.join(recoverPath, 'vectorizer.json'));
  if(modelJson) classifier.load(modelJson);
  if(vecorizerJson) vectorizer.load(vectorizerJson);*/
  return [ classifier, vectorizer ];
};

const modelTrain = async (runtime, options, context, model) => {
  const { mode = 'cn' } = options;
  const { modelDir } = context.workspace;
  const [ classifier, vectorizer ] = model;  

  const rawData = [];
  const rawClass = [];
  // access train samples
  const trainSamples = await runtime.dataset.train.nextBatch(-1);
  trainSamples.forEach((d) => {
    rawData.push(d.data);
    rawClass.push(d.label.toString());
  });
  // process text dataset
  const [ trainWordsList, trainClassList ] = textProcessing(rawData, rawClass);
  let stopWords = mode === 'en' ? en : cn;
  vectorizer.initDict(trainWordsList, stopWords);
  const trainVector = vectorizer.transform(trainWordsList);
  // train model
  await classifier.train(trainVector, trainClassList);
  // predict
  const predClass = classifier.predict(trainVector);
  const acc = accuracyScore(rawClass, predClass);
  console.log(`train accuracy: ${acc}`);
  // save model file 
  await fs.writeFile(path.join(modelDir, 'model.json'), classifier.toJson());
  await fs.writeFile(path.join(modelDir, 'vectorizer.json'), vectorizer.toJson());
  await runtime.saveModel(modelDir);
};

let predictModel;

module.exports = {
  train: async (runtime, options, context) => {
    let model = await modelDefine(options, context);
    await modelTrain(runtime, options, context, model);
  },
  // predict: async (runtime, options, context) => {
  //   if (!predictModel) {
  //     predictModel = await modelLoad(options, context);
  //     await 
  //   }
  // }
}

