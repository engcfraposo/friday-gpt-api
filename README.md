# Friday GPT API

![GitHub last commit](https://img.shields.io/github/last-commit/engcfraposo/friday-gpt-api)

This is an API that uses NestJS with access to the ChatGPT, Dall-e, and Azure cognitive services (text-to-speech and speech-to-text). The API is able to generate text, images, speech, and transcription from speech.

## Technologies

This project was built with:

-   [NestJS](https://nestjs.com/)
-   [ChatGPT](https://github.com/openai/gpt-3)
-   [DALL-E](https://github.com/lucidrains/DALL-E-pytorch)
-   [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)

## Installation

```bash
$ npm install

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

## Endpoints

The following endpoints are available:

-   `POST /chat/ask` - Given a prompt in the request body, returns a response generated by the ChatGPT.
-   `POST /chat/image` - Given a prompt in the request body, returns an image generated by Dall-e.
-   `POST /chat/text-to-speech` - Given a text prompt in the request body, returns an audio file generated by Azure's text-to-speech service.
-   `POST /chat/transcribe` - Given an audio file in the request body, returns the transcription of the speech using Azure's speech-to-text service.
-   `POST /chat/bot` - Given an audio file in the request body, returns a response generated by the ChatGPT.

## License

This project is [MIT licensed](https://chat.openai.com/chatLICENSE).