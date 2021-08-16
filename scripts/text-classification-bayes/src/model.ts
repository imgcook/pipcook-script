/**
 * @file This is for the plugin to load Bayes Classifier model.
 */
import * as path from 'path';
import * as fs from 'fs-extra';
<<<<<<< HEAD
import { ModelEntry, Runtime, ScriptContext, DatasetPool, DataCook } from '@pipcook/core';
=======
import { ModelEntry, Runtime, ScriptContext, DatasetPool } from '@pipcook/core';
>>>>>>> fe00a8e14b66b37e1895b56297fe223295f18bda
import {
  getBayesModel,
  loadModel,
  TextProcessing,
  MakeWordsSet,
  words_dict,
  TextFeatures,
  save_all_words_list,
  saveBayesModel
} from './script';
import * as boa from '@pipcook/boa';
import { cn, en } from './stopwords';
import * as Types from './types';

/**
 * Pipcook Plugin: bayes classifier model
 */
const modelDefine = async (options: Record<string, any>, _: ScriptContext): Promise<any> => {
  const sys = boa.import('sys');
  const {
    recoverPath
  } = options;

  sys.path.insert(0, path.join(__dirname, 'assets'));
  let classifier: any;

  if (!recoverPath) {
    // assertionTest(data);
    classifier = getBayesModel(boa);
  } else {
    classifier = await loadModel(path.join(recoverPath, 'model.pkl'), boa);
  }
  return classifier;
};

/**
 *
 * @param data Pipcook uniform data
 * @param model Eshcer model
 */
const modelTrain = async (runtime: Runtime<Types.Sample, DatasetPool.Types.ObjectDetectionDatasetMeta>, options: Record<string, any>, context: ScriptContext, model: any): Promise<any> => {
  const {
    mode = 'cn'
  } = options;
  const { modelDir } = context.workspace;
  const sys = boa.import('sys');

  sys.path.insert(0, path.join(__dirname, 'assets'));

  const classifier = model;

  const rawData = [];
  const rawClass = [];
  let sample = await runtime.dataset.train?.next();
  while (sample) {
    rawData.push(sample.data);
    rawClass.push(sample.label.toString());
    sample = await runtime.dataset.train?.next();
  };
  const text_list = TextProcessing(rawData, rawClass, boa);

  let stopWords = mode === 'en' ? en : cn;
  const stopwords_set = await MakeWordsSet(stopWords);
  const feature_words = words_dict(text_list[0], stopwords_set);
  const feature_list = TextFeatures(text_list[1], feature_words, boa);
  classifier.fit(feature_list, text_list[2]);
  await fs.writeFile(path.join(modelDir, 'stopwords.txt'), stopWords);
  save_all_words_list(feature_words, path.join(modelDir, 'feature_words.pkl'), boa);
  saveBayesModel(classifier, path.join(modelDir, 'model.pkl'), boa);
  await runtime.saveModel(modelDir);
  return classifier;
};

const main: ModelEntry<Types.Sample, DatasetPool.Types.ObjectDetectionDatasetMeta>
  = async (runtime, options, context) => {
  boa.setenv(path.join(context.workspace.frameworkDir, 'site-packages'));
  let model = await modelDefine(options, context);
  model = await modelTrain(runtime, options, context, model);
};
export default main;
