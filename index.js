const agent = require('superagent');
const asciify = require('asciify-image');

const DOG_API_URL = 'https://dog.ceo/api';

const getDogByBreedImageUrl = async (breed) => {
  const dogApiEndpointUrl = `${DOG_API_URL}/breed/${breed}/images/random`;
  const { body: { message: dogUrl }} = await agent.get(dogApiEndpointUrl);
  return dogUrl;
};

(async () => {
  // Get a URL for a random image of a dog
  const dogUrl = await getDogByBreedImageUrl('bulldog/boston');

  // Download the image
  const { body: data } = await agent.get(dogUrl);

  // Convert the image to ascii
  const ascii = await asciify(data, {
    fit: 'box',
    width: 60,
    height: 60,
  });

  // Print the ascii
  console.log(ascii);
})();
