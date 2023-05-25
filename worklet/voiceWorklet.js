class VoiceWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
  }

  process(inputs, outputs, parameters) {
    const freqParam = parameters.frequency;
    const toneParam = parameters.tone;
    const channel = outputs[0][0];
    for (let i = 0; i < channel.length; i++) {
      const freq = freqParam.length > 1 ? freqParam[i] : freqParam[0];
      const tone = toneParam.length > 1 ? toneParam[i] : toneParam[0];
      const OQ = parameters.N1.length > 1 ? parameters.N1[i] : parameters.N1[0];

      this.phase += freq / sampleRate;
      this.phase %= 1;

      const { phase } = this;

      if (phase <= OQ) {
        const oph = phase / OQ;
        channel[i] = -5 * oph * oph + 6 * Math.pow(oph, 4);
      } else {
        channel[i] = 0;
      }
    }
    return true;
  }
}

VoiceWorkletProcessor.parameterDescriptors = [
  {
    name: "tone",
    minValue: 0,
    maxValue: 1,
    defaultValue: 0.1,
  },
  {
    name: "frequency",
    minValue: 0,
    maxValue: 20000,
    defaultValue: 100,
  },
  {
    name: "N1",
    minValue: 0,
    maxValue: 1,
    defaultValue: 0.5,
  },
]

registerProcessor('voice-source', VoiceWorkletProcessor)
