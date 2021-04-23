'use strict';

import fs from 'fs';
import readline from 'readline';
import { zip, unzip } from 'lodash';

function strip(str: string): string {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

function isdigit(str: string): boolean {
  return /^\d+$/.test(str);
}

export function MakeWordsSet(allWords: string): Set<string> {
  const wordsSet = new Set<string>();
  let wordsList = allWords.split('\n');
  for(let i = 0; i < wordsList.length; i++) {
    const word = strip(wordsList[i]);
    if (word.length > 0 && !wordsSet.has(word)) {
      wordsSet.add(word);
    }
  }
  return wordsSet;
}

export function words_dict(all_words_list: string[], stopwords_set = new Set<string>()): string[] {
  const feature_words: string[] = [];
  for (let word of all_words_list) {
    if (!isdigit(word) &&
        !stopwords_set.has(word) &&
        word.length > 1 &&
        word.length < 5) {
      feature_words.push(word);
    }
  }

  return feature_words;
}

export const getBayesModel = function (boa: any) {
  const { MultinomialNB } = boa.import('sklearn.naive_bayes');
  return MultinomialNB();
};

export const loadModel = async function (filepath: string, boa: any) {
  const pickle = boa.import('pickle');
  const { open } = boa.builtins();
  return boa.with(open(filepath, 'rb'), pickle.load);
};
interface AllWordsDict {
  [key: string]: [ string, number ];
}
export const TextProcessing = function(row_data: string[], row_class: string[], boa: any): any[][] {
  const jieba = boa.import('jieba');
  const random = boa.import('random');

  const { list } = boa.builtins();

  const data_list: string[][] = [];
  const class_list: string[] = [];

  row_data.forEach((data, i) => {
    const word_cut: string[] = jieba.cut(data, boa.kwargs({
      cut_all: false
    }));
    data_list.push(list(word_cut));
    class_list.push(row_class[i]);
  });
  // split train set and testing set
  const data_class_list = zip(data_list, class_list);
  random.shuffle(data_class_list);
  const [ train_data_list, train_class_list ] = unzip(data_class_list);

  const all_words_dict: AllWordsDict = {};
  for (const word_list of train_data_list) {
    for (const word of word_list) {
      if (!all_words_dict[word]) {
        all_words_dict[word] = [ word, 1 ];
      } else {
        all_words_dict[word][1] += 1;
      }
    }
  }

  const all_words_tuple_list = Object.values(all_words_dict).sort((item1, item2) => item2[1] - item1[1]);
  const all_words_list = unzip(all_words_tuple_list)[0];

  return [ all_words_list, train_data_list, train_class_list ];
};

function text_features(text: string, feature_words: string[], boa: any) {
  const { set } = boa.builtins();
  const text_words = set(text);
  return boa.eval`[1 if word in ${text_words} else 0 for word in ${feature_words}]`;
}

export const TextFeatures = function(train_data_list: string[], feature_words: string[], boa: any) {
  return train_data_list.map((text: string) => {
    return text_features(text, feature_words, boa);
  });
};

export const save_all_words_list = function(feature_words: any, filepath: string, boa: any) {
  const pickle = boa.import('pickle');

  const { open } = boa.builtins();

  return boa.with(open(filepath, 'wb'), (f: any) => {
    return pickle.dump(feature_words, f);
  });
};

export const saveBayesModel = function(classifier: any, filepath: string, boa: any) {
  const pickle = boa.import('pickle');

  const { open } = boa.builtins();
  return boa.with(open(filepath, 'wb'), (f: any) => {
    return pickle.dump(classifier, f);
  });
};
