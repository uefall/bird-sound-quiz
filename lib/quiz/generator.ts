import { recordingsPool, speciesPool } from "./mockData";
import { OPTION_IDS, pickRandom, shuffle } from "../utils/random";
import type {
  AudioToImageQuestion,
  AudioToNameQuestion,
  QuizQuestion,
  SessionConfig,
  Species,
} from "../../types/quiz";

function pickDistractors(correct: Species, count: number): Species[] {
  const sameFamily = speciesPool.filter(
    (item) =>
      item.speciesId !== correct.speciesId &&
      item.taxonomy.family === correct.taxonomy.family,
  );

  const sameOrder = speciesPool.filter(
    (item) =>
      item.speciesId !== correct.speciesId &&
      item.taxonomy.order === correct.taxonomy.order &&
      item.taxonomy.family !== correct.taxonomy.family,
  );

  const others = speciesPool.filter(
    (item) =>
      item.speciesId !== correct.speciesId &&
      item.taxonomy.order !== correct.taxonomy.order,
  );

  const picked: Species[] = [];
  const buckets = [shuffle(sameFamily), shuffle(sameOrder), shuffle(others)];
  for (const bucket of buckets) {
    for (const candidate of bucket) {
      if (picked.length >= count) {
        return picked;
      }
      if (!picked.some((item) => item.speciesId === candidate.speciesId)) {
        picked.push(candidate);
      }
    }
  }

  if (picked.length < count) {
    for (const candidate of shuffle(speciesPool)) {
      if (picked.length >= count) {
        break;
      }
      if (candidate.speciesId === correct.speciesId) {
        continue;
      }
      if (!picked.some((item) => item.speciesId === candidate.speciesId)) {
        picked.push(candidate);
      }
    }
  }

  return picked.slice(0, count);
}

function buildNameQuestion(
  sessionId: string,
  index: number,
  timeLimitSec: number,
): AudioToNameQuestion {
  const recording = pickRandom(recordingsPool);
  const correctSpecies = speciesPool.find(
    (item) => item.speciesId === recording.speciesId,
  );
  if (!correctSpecies) {
    throw new Error(`Unknown species: ${recording.speciesId}`);
  }
  const distractors = pickDistractors(correctSpecies, 3);
  const optionSpecies = shuffle([correctSpecies, ...distractors]);

  const options = optionSpecies.map((species, optionIndex) => ({
    optionId: OPTION_IDS[optionIndex],
    speciesId: species.speciesId,
    scientificName: species.scientificName,
  }));

  const correctOption = options.find(
    (option) => option.speciesId === correctSpecies.speciesId,
  );
  if (!correctOption) {
    throw new Error("Failed to generate correct option for name question");
  }

  return {
    questionId: `q_${sessionId}_${index + 1}`,
    sessionId,
    index: index + 1,
    mode: "audio_to_name",
    prompt: "请根据鸟叫声选择正确学名",
    timeLimitSec,
    audio: {
      url: recording.audioUrl,
      durationSec: recording.durationSec,
      license: recording.license,
      source: "xeno-canto",
      sourceId: recording.sourceId,
    },
    options,
    correctOptionId: correctOption.optionId,
    correctSpeciesId: correctSpecies.speciesId,
  };
}

function buildImageQuestion(
  sessionId: string,
  index: number,
  timeLimitSec: number,
): AudioToImageQuestion {
  const recording = pickRandom(recordingsPool);
  const correctSpecies = speciesPool.find(
    (item) => item.speciesId === recording.speciesId,
  );
  if (!correctSpecies) {
    throw new Error(`Unknown species: ${recording.speciesId}`);
  }
  const distractors = pickDistractors(correctSpecies, 3);
  const optionSpecies = shuffle([correctSpecies, ...distractors]);

  const options = optionSpecies.map((species, optionIndex) => ({
    optionId: OPTION_IDS[optionIndex],
    speciesId: species.speciesId,
    imageUrl: species.imageUrl,
  }));

  const correctOption = options.find(
    (option) => option.speciesId === correctSpecies.speciesId,
  );
  if (!correctOption) {
    throw new Error("Failed to generate correct option for image question");
  }

  return {
    questionId: `q_${sessionId}_${index + 1}`,
    sessionId,
    index: index + 1,
    mode: "audio_to_image",
    prompt: "请根据鸟叫声选择对应图片",
    timeLimitSec,
    audio: {
      url: recording.audioUrl,
      durationSec: recording.durationSec,
      license: recording.license,
      source: "xeno-canto",
      sourceId: recording.sourceId,
    },
    options,
    correctOptionId: correctOption.optionId,
    correctSpeciesId: correctSpecies.speciesId,
  };
}

export function buildQuestions(
  sessionId: string,
  config: SessionConfig,
): QuizQuestion[] {
  const timeLimitSec = config.level >= 3 ? 12 : config.level === 2 ? 16 : 20;

  return Array.from({ length: config.questionCount }, (_, index) => {
    if (config.mode === "audio_to_name") {
      return buildNameQuestion(sessionId, index, timeLimitSec);
    }
    return buildImageQuestion(sessionId, index, timeLimitSec);
  });
}
