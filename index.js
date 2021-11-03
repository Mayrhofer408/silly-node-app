const agent = require('superagent');
const asciify = require('asciify-image');
const prompts = require('prompts');

const DOG_API_URL = 'https://dog.ceo/api';

const getBreedList = async () => {
  const dogApiBreedsEndpointUrl = `${DOG_API_URL}/breeds/list/all`;
  const {
    body: {message: breedDict},
  } = await agent.get(dogApiBreedsEndpointUrl);
  return breedDict;
};

const getDogByBreedImageUrl = async (breed) => {
  const dogApiImageEndpointUrl = `${DOG_API_URL}/breed/${breed}/images/random`;
  const {
    body: {message: dogUrl},
  } = await agent.get(dogApiImageEndpointUrl);
  return dogUrl;
};

function flattenBreedDict(breedDict) {
  const flatBreedList = [];
  Object.entries(breedDict).forEach(([breed, breedPrefixes]) => {
    if (!breedPrefixes || breedPrefixes.length < 1) {
      flatBreedList.push(breed);
    } else {
      breedPrefixes.forEach((prefix) => {
        flatBreedList.push(`${prefix} ${breed}`);
      });
    }
  });

  return flatBreedList;
}

const promptForBreed = async (availableBreeds) => {
  const {value} = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: 'Pick a breed, any breed:',
    choices: availableBreeds.map((breed) => ({title: breed})),
  });
  if (!value) {
    throw new Error('User did not pick a breed!');
  }
  return value;
};

(async () => {
  // Get hierarchical dict of all breeds from API
  const breedListAsDict = await getBreedList();

  // Flatten breed dict into array of strings
  const breedList = flattenBreedDict(breedListAsDict);

  // Get a single breed string by prompting the user
  const pickedBreed = await promptForBreed(breedList);

  // Get a URL for a random image of a dog with picked breed from API
  const dogUrl = await getDogByBreedImageUrl(pickedBreed);

  // Download the image
  const {body: data} = await agent.get(dogUrl);

  // Convert the image to ascii
  const ascii = await asciify(data, {
    fit: 'box',
    width: 60,
    height: 60,
  });

  // Print the ascii
  console.log(ascii);
})();
