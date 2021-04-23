/**
 * @file This is for the plugin to load Bayes Classifier model.
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import { ModelEntry, Runtime, ScriptContext } from '@pipcook/pipcook-core';
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
import { cn, en } from './stopwords';

/**
 * Pipcook Plugin: bayes classifier model
 * @param data Pipcook uniform sample data
 * @param args args. If the model path is provided, it will restore the model previously saved
 */
const modelDefine = async (runtime: Runtime<string>, options: Record<string, any>, context: ScriptContext): Promise<any> => {
  const { boa } = context;
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
const modelTrain = async (runtime: Runtime<string>, options: Record<string, any>, context: ScriptContext, model: any): Promise<any> => {
  const {
    mode = 'cn'
  } = options;
  const { modelDir } = context.workspace;
  const { boa } = context;
  const sys = boa.import('sys');

  sys.path.insert(0, path.join(__dirname, 'assets'));

  const classifier = model;

  const rawData = [];
  const rawClass = [];
  // @ts-ignore
  let sample = await runtime.dataset.train.next();
  while (sample) {
    rawData.push(sample.data);
    rawClass.push(sample.label.toString());
    // @ts-ignore
    sample = await runtime.dataset.train.next();
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
  await runtime.saveModel(modelDir, '');
  return classifier;
};

const main: ModelEntry<string> = async(runtime: Runtime<string>, options: Record<string, any>, context: ScriptContext) => {
  let model = await modelDefine(runtime, options, context);
  model = await modelTrain(runtime, options, context, model);
};
export default main;
