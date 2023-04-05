import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SpeechConfig,
  SpeechRecognizer,
  AudioConfig,
  ResultReason,
  SpeechSynthesisOutputFormat,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';

@Injectable()
export class AzureOpenAIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  transcribe(audio: Buffer, originalLanguage?: string) {
    const audioConfig = AudioConfig.fromWavFileInput(audio);
    const speechConfig = SpeechConfig.fromSubscription(
      this.configService.get('AZURE_COGNITIVE_KEY'),
      'eastus',
    );
    speechConfig.speechRecognitionLanguage = originalLanguage || 'pt-BR';

    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    recognizer.startContinuousRecognitionAsync();

    return new Promise<any>((resolve, reject) => {
      recognizer.recognized = (_, event) => {
        if (event.result.reason === ResultReason.RecognizedSpeech) {
          console.log(event.result)
          const text = event.result.text.replace('\n', '');
          resolve({ text });
        }
      };

      recognizer.canceled = (_, event) => {
        reject(new InternalServerErrorException(event.errorDetails));
      };

      recognizer.sessionStopped = () => {
        recognizer.stopContinuousRecognitionAsync();
      };
    });
  }

  async textToSpeech(text: string): Promise<PassThrough> {
    const speechConfig = SpeechConfig.fromSubscription(
      this.configService.get('AZURE_COGNITIVE_KEY'),
      'eastus',
    );
    speechConfig.speechSynthesisLanguage = 'pt-BR';
    speechConfig.speechSynthesisVoiceName = 'pt-BR-LeilaNeural';
    speechConfig.speechSynthesisOutputFormat =
      SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;

    let synthesizer = new SpeechSynthesizer(speechConfig);

    const audioContent = await new Promise<ArrayBuffer>((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            console.log('[getTts] synthesis finished.');
          } else {
            console.error(
              '[getTts] Speech synthesis canceled, ' +
                result.errorDetails +
                '\nDid you set the speech resource key and region values?',
            );
            reject(result.errorDetails);
            return;
          }
          const { audioData } = result;
          synthesizer.close();
          resolve(audioData);
        },
        (err) => {
          console.error('[getTts]', err);
          synthesizer.close();
          synthesizer = null;
          reject(err);
        },
      );
    });

    const bufferStream = new PassThrough();
    bufferStream.end(Buffer.from(audioContent));
    return bufferStream;
  }

  askToGPT(question: string) {
    const data = JSON.stringify({
      prompt: question,
      max_tokens: 4000,
      temperature: 0.7,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 1,
      best_of: 1,
      stop: null,
    });
    return this.httpService.post('/completions?api-version=2022-12-01', data);
  }
}
