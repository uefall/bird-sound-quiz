import type { Recording, Species } from "../../types/quiz";

export const speciesPool: Species[] = [
  {
    speciesId: "sp_001",
    scientificName: "Pycnonotus sinensis",
    commonNameZh: "白头鹎",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Light-vented_Bulbul.jpg/640px-Light-vented_Bulbul.jpg",
    taxonomy: { order: "Passeriformes", family: "Pycnonotidae" },
  },
  {
    speciesId: "sp_002",
    scientificName: "Parus minor",
    commonNameZh: "煤山雀",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Japanese_Tit_Parus_minor.jpg/640px-Japanese_Tit_Parus_minor.jpg",
    taxonomy: { order: "Passeriformes", family: "Paridae" },
  },
  {
    speciesId: "sp_003",
    scientificName: "Zosterops japonicus",
    commonNameZh: "暗绿绣眼鸟",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Japanese_white-eye_Zosterops_japonicus.jpg/640px-Japanese_white-eye_Zosterops_japonicus.jpg",
    taxonomy: { order: "Passeriformes", family: "Zosteropidae" },
  },
  {
    speciesId: "sp_004",
    scientificName: "Cyanopica cyanus",
    commonNameZh: "灰喜鹊",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Azure-winged_Magpie_Cyanopica_cyanus.jpg/640px-Azure-winged_Magpie_Cyanopica_cyanus.jpg",
    taxonomy: { order: "Passeriformes", family: "Corvidae" },
  },
  {
    speciesId: "sp_005",
    scientificName: "Turdus mandarinus",
    commonNameZh: "乌鸫",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Chinese_Blackbird_Turdus_mandarinus.jpg/640px-Chinese_Blackbird_Turdus_mandarinus.jpg",
    taxonomy: { order: "Passeriformes", family: "Turdidae" },
  },
  {
    speciesId: "sp_006",
    scientificName: "Passer montanus",
    commonNameZh: "树麻雀",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Passer_montanus_male.jpg/640px-Passer_montanus_male.jpg",
    taxonomy: { order: "Passeriformes", family: "Passeridae" },
  },
  {
    speciesId: "sp_007",
    scientificName: "Copsychus saularis",
    commonNameZh: "鹊鸲",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Copsychus_saularis_-_Kolkata_8.jpg/640px-Copsychus_saularis_-_Kolkata_8.jpg",
    taxonomy: { order: "Passeriformes", family: "Muscicapidae" },
  },
  {
    speciesId: "sp_008",
    scientificName: "Streptopelia orientalis",
    commonNameZh: "山斑鸠",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Streptopelia_orientalis.jpg/640px-Streptopelia_orientalis.jpg",
    taxonomy: { order: "Columbiformes", family: "Columbidae" },
  },
];

export const recordingsPool: Recording[] = [
  {
    recordingId: "rec_001",
    speciesId: "sp_001",
    audioUrl: "https://xeno-canto.org/819228/download",
    durationSec: 7.6,
    quality: "A",
    license: "CC BY-NC 4.0",
    source: "xeno-canto",
    sourceId: "XC819228",
  },
  {
    recordingId: "rec_002",
    speciesId: "sp_002",
    audioUrl: "https://xeno-canto.org/840617/download",
    durationSec: 6.1,
    quality: "A",
    license: "CC BY-NC 4.0",
    source: "xeno-canto",
    sourceId: "XC840617",
  },
  {
    recordingId: "rec_003",
    speciesId: "sp_003",
    audioUrl: "https://xeno-canto.org/905915/download",
    durationSec: 8.2,
    quality: "B",
    license: "CC BY-NC 4.0",
    source: "xeno-canto",
    sourceId: "XC905915",
  },
  {
    recordingId: "rec_004",
    speciesId: "sp_004",
    audioUrl: "https://xeno-canto.org/925675/download",
    durationSec: 5.3,
    quality: "A",
    license: "CC BY-NC 4.0",
    source: "xeno-canto",
    sourceId: "XC925675",
  },
  {
    recordingId: "rec_005",
    speciesId: "sp_005",
    audioUrl: "https://xeno-canto.org/904616/download",
    durationSec: 9.1,
    quality: "B",
    license: "CC BY-NC 4.0",
    source: "xeno-canto",
    sourceId: "XC904616",
  },
  {
    recordingId: "rec_006",
    speciesId: "sp_006",
    audioUrl: "https://xeno-canto.org/873329/download",
    durationSec: 4.8,
    quality: "A",
    license: "CC BY-NC 4.0",
    source: "xeno-canto",
    sourceId: "XC873329",
  },
  {
    recordingId: "rec_007",
    speciesId: "sp_007",
    audioUrl: "https://xeno-canto.org/879355/download",
    durationSec: 10.2,
    quality: "B",
    license: "CC BY-NC 4.0",
    source: "xeno-canto",
    sourceId: "XC879355",
  },
  {
    recordingId: "rec_008",
    speciesId: "sp_008",
    audioUrl: "https://xeno-canto.org/856714/download",
    durationSec: 6.5,
    quality: "A",
    license: "CC BY-NC 4.0",
    source: "xeno-canto",
    sourceId: "XC856714",
  },
];
