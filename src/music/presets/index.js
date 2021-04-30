const EXP = 'exponentialRampToValueAtTime';
const LIN = 'linearRampToValueAtTime';

const BUILT_IN = 'sine,square,sawtooth,etc.';
const CUSTOM = 'real&imaginary';

class Waveform {
    constructor(superType, type = null, real = [], imag = []) {
        this.superType = superType;
        if(superType === BUILT_IN) {
            this.type = type;
        }
        if(superType === CUSTOM) {
            if(imag.length === 0) {
                imag = real.map(_ => 0);
            }
            this.real = real;
            this.imag = imag;
        }
    }

    addToOscillator(oscillator, context = null) {
        if(this.superType === BUILT_IN) {
            oscillator.type = this.type;
            return oscillator;
        } else if(this.superType === CUSTOM) {
            if(context === null) {
                console.error('No context set for custom waveform!');
                return oscillator;
            }
            const customWave = context.createPeriodicWave(this.real,this.imag, {disableNormalization: true});
            oscillator.setPeriodicWave(customWave);
            return oscillator;
        }
    }
}

class Synth {
    constructor(
        decay,
        gain,
        gainRampTime = 0.01,
        gainMethod = EXP,
        decayMethod = EXP,
        vibratoFacts = null,
        waveform = new Waveform(BUILT_IN, 'sine')
        ) {
        this.decay = decay;
        this.gain = gain;
        this.gainRampTime = gainRampTime;
        this.gainMethod = gainMethod;
        this.decayMethod = decayMethod;
        this.vibratoFacts = vibratoFacts;
        this.waveform = waveform;
    }

    playNote(context, frequency, noteLength, useOscillator=()=>{}) {
        const oscillator = this.getOscillator(context, frequency);
        if(this.vibratoFacts) {
            this.vibrato(
                context, 
                oscillator.frequency,
                this.vibratoFacts[0],
                this.vibratoFacts[1],
                (noteLength/2));
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useOscillator(oscillator);
        oscillator.start(context.currentTime);
    
        setTimeout(() => oscillator.stop(context.currentTime), noteLength);
    }

    getOscillator(context, frequency) {
        const oscillator = context.createOscillator()
        oscillator.frequency.value = frequency;

        const withWaveform = this.waveform.addToOscillator(oscillator, context);
        const withEnvelope = this.withEnvelope(
            context,
            withWaveform,
            this.decay,
            this.gain,
            this.gainRampTime,
            this.gainMethod,
            this.decayMethod
        );
        return withEnvelope;
    }

    withEnvelope(
        context,
        oscillator,
        decayRate,
        gain,
        gainRampTime,
        gainMethod = 'exponentialRampToValueAtTime',
        decayMethod = 'exponentialRampToValueAtTime'
        ) {
        const envelope = context.createGain();
        envelope.gain.setValueAtTime(0, context.currentTime);
        oscillator.connect(envelope);
        envelope.connect(context.destination);
        envelope.gain[gainMethod](gain, context.currentTime + gainRampTime);
        envelope.gain[decayMethod](0.01, context.currentTime + decayRate);
        envelope.connect(context.destination);
        return oscillator;
    }

    vibrato (context, frequency, rate, gain, lengthOfNote) {
        const oscillator = context.createOscillator();
        oscillator.frequency.value = rate;
    
        const envelope = context.createGain();
        envelope.gain.value = gain;
    
        oscillator.connect(envelope).connect(frequency);
        oscillator.start(context.currentTime);
        setTimeout(() => oscillator.stop(context.currentTime + lengthOfNote), lengthOfNote - 8);
    }
}

const STRING_WAVEFORM = new Waveform(
    CUSTOM,
    null,
    [0,0.25,0.084,0.0954,0.0869,0.15,0.29,-0.33,-0.1,-0.199,0.25,0.012,0.0134,0.006,0.003,0.0006,-0.0036,-0.0029,-0.003527,-0.002975,-0.002648,-0.006996,-0.004165,-0.004266,-0.000731,0.003727,0.018167,0.012018,-0.017044,-0.004816,-0.001255,-0.002032,0.000272,-0.001849,0.004334,0.000773,-0.000690,-0.000207,0.000136,-0.000108,0.000508,-0.000701,-0.000958,-0.004677,0.002005,-0.001925,-0.001450,-0.002212,-0.001163,-0.000227,0.000182,-0.000448,0.000152,-0.000316,-0.000054,-0.000193,-0.000170,-0.000138,-0.000179,0.000059,0.000017,0.000008,0.000252,0.000382,-0.000319,0.000020,-0.000087,0.000020],
    [0,-0.012,0.1064,0.027196,0.040770,0.010807,-0.176320,-0.376644,0.052966,0.242678,0.322558,-0.029071,-0.017862,-0.018765,-0.010794,-0.010157,-0.004212,-0.001923,-0.002589,-0.000607,-0.001983,-0.000421,-0.001835,0.003069,0.005389,0.012023,0.003422,-0.013914,-0.008548,0.007815,0.002234,0.003867,0.000488,0.000824,-0.002685,-0.000085,-0.002967,-0.000125,-0.000831,-0.000192,-0.000222,-0.003892,0.000474,-0.002069,0.001899,0.001648,-0.000490,0.001615,-0.000309,-0.000211,-0.000327,-0.000702,0.000325,-0.000152,0.000048,0.000011,0.000152,-0.000106,-0.000003,-0.000063,0.000026,-0.000104,-0.000479,-0.000528,-0.000551,-0.000202, -0.00025, -0.00020]
);

// Built-ins
const SINE = new Synth(2, 1);
const SAWTOOTH = new Synth(2, 1);
SAWTOOTH.waveform.type = 'sawtooth';
const SQUARE = new Synth(2, 1);
SQUARE.waveform.type = 'square';
const TRIANGLE = new Synth(2, 1);
TRIANGLE.waveform.type = 'triangle';
const BOWED = new Synth(
    1,
    0.3,
    0.3,
    LIN,
    EXP,
    [22, 0.22],
    STRING_WAVEFORM
);
const PLUCKED = new Synth(
    0.8,
    0.3,
    0.1,
    EXP,
    EXP,
    [22, 0.22],
    STRING_WAVEFORM
);
const VAMPIRE_CASTLE = new Synth(
    2,
    0.3,
    0.01,
    EXP,
    EXP,
    null,
    new Waveform(
        CUSTOM,
        null,
        [0,0.8,-0.9,0.9,1,0.9,-0.8,0.8,-0.6,0.6,0,0,0.4,0.2,0.1,-1,1],
        [0,0,0,0,0,0.9,-0.8,0.8,-0.6,0.6,0,0,0.2,0.4,0,1,-1]
    )
);
const BIT_VOICE = new Synth(
    0.6,
    0.3,
    0.4,
    LIN,
    EXP,
    null,
    new Waveform(
        CUSTOM,
        null,
        [0,0.25,0.084,0.0954,0.0869,0.15,0.29,-0.33,-0.1,-0.199,0.25,0.012,0.0134,0.006,0.003,0.0006,-0.0036,-0.0029,-0.003527,-0.002975,-0.002648,-0.006996,-0.004165,-0.004266,-0.000731,0.003727,0.018167,0.012018,-0.017044,-0.004816,-0.001255,-0.002032,0.000272,-0.001849,0.004334,0.000773,-0.000690,-0.000207,0.000136,-0.000108,0.000508,-0.000701,-0.000958,-0.004677,0.002005,-0.001925,-0.001450,-0.002212,-0.001163,-0.000227,0.000182,-0.000448,0.000152,-0.000316,-0.000054,-0.000193,-0.000170,-0.000138,-0.000179,0.000059,0.000017,0.000008,0.000252,0.000382,-0.000319,0.000020,-0.000087,0.000020],
        [0,-0.012,0.1064,0.027196,0.040770,0.010807,-0.176320,-0.376644,0.052966,0.242678,0.322558,-0.029071,-0.017862,-0.018765,-0.010794,-0.010157,-0.004212,-0.001923,-0.002589,-0.000607,-0.001983,-0.000421,-0.001835,0.003069,0.005389,0.012023,0.003422,-0.013914,-0.008548,0.007815,0.002234,0.003867,0.000488,0.000824,-0.002685,-0.000085,-0.002967,-0.000125,-0.000831,-0.000192,-0.000222,-0.003892,0.000474,-0.002069,0.001899,0.001648,-0.000490,0.001615,-0.000309,-0.000211,-0.000327,-0.000702,0.000325,-0.000152,0.000048,0.000011,0.000152,-0.000106,-0.000003,-0.000063,0.000026,-0.000104,-0.000479,-0.000528,-0.000551,-0.000202, -0.00025, -0.00020]
    )
)
const WINE_GLASS = new Synth(
    0.62,
    0.3,
    0.4,
    LIN,
    EXP,
);

const DEFAULT_SYNTH_SETTINGS = {
    decay: 2,
    gain: 1,
    gainRampTime: 0.01,
    gainMethod: EXP,
    decayMethod: EXP,
    vibratoFacts: ['',''],
    waveform: {
        superType: BUILT_IN,
        type: 'sine',
        real: '',
        imag: ''
    }
};

export {
    EXP, LIN, BUILT_IN, CUSTOM,
    Waveform, Synth,
    SINE, SAWTOOTH, SQUARE, TRIANGLE,
    BOWED, PLUCKED, VAMPIRE_CASTLE, BIT_VOICE, WINE_GLASS,
    DEFAULT_SYNTH_SETTINGS
};
    