import React, { useState } from 'react';
import {
    Button,
    Grid,
    Typography
} from '@material-ui/core';
import SoundElementContainer from './soundelement-container';

const withEnvelope = (
    context,
    oscillator,
    decayRate,
    gain,
    gainRampTime,
    gainMethod = 'exponentialRampToValueAtTime',
    decayMethod = 'exponentialRampToValueAtTime'
    ) => {
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0, context.currentTime);
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    envelope.gain[gainMethod](gain, context.currentTime + gainRampTime);
    envelope.gain[decayMethod](0.01, context.currentTime + decayRate);
    return envelope;
}

const vibrato = (context, frequency, rate, gain, lengthOfNote) => {
    const oscillator = context.createOscillator();
    oscillator.frequency.value = rate;

    const envelope = context.createGain();
    envelope.gain.value = gain;

    oscillator.connect(envelope).connect(frequency);
    oscillator.start(context.currentTime);
    setTimeout(() => oscillator.stop(context.currentTime + lengthOfNote), lengthOfNote - 8)
}

const playNote = (frequency, context, lengthOfNote) => {
    const oscillator = context.createOscillator()
    
    oscillator.frequency.value = frequency;
    // oscillator.type = 'sine';

    let vibratoFacts = null;

    // percussion
    // const decay = 0.01;
    // const gain = 5;

    // vampire castle-ish sound
    // const real = [0,0.8,-0.9,0.9,1,0.9,-0.8,0.8,-0.6,0.6,0,0,0.4,0.2,0.1,-1,1];
    // const imag = [0,0,0,0,0,0.9,-0.8,0.8,-0.6,0.6,0,0,0.2,0.4,0,1,-1];
    // const decay = 2;
    // const gain = 0.3;
    // const gainRampTime = 0.01
    // const gainMethod = 'exponentialRampToValueAtTime';
    // const decayMethod = 'exponentialRampToValueAtTime';

    // voice-ish sound
    // const real = [0,0.25,0.084,0.0954,0.0869,0.15,0.29,-0.33,-0.1,-0.199,0.25,0.012,0.0134,0.006,0.003,0.0006,-0.0036,-0.0029,-0.003527,-0.002975,-0.002648,-0.006996,-0.004165,-0.004266,-0.000731,0.003727,0.018167,0.012018,-0.017044,-0.004816,-0.001255,-0.002032,0.000272,-0.001849,0.004334,0.000773,-0.000690,-0.000207,0.000136,-0.000108,0.000508,-0.000701,-0.000958,-0.004677,0.002005,-0.001925,-0.001450,-0.002212,-0.001163,-0.000227,0.000182,-0.000448,0.000152,-0.000316,-0.000054,-0.000193,-0.000170,-0.000138,-0.000179,0.000059,0.000017,0.000008,0.000252,0.000382,-0.000319,0.000020,-0.000087,0.000020];
    // const imag = [0,-0.012,0.1064,0.027196,0.040770,0.010807,-0.176320,-0.376644,0.052966,0.242678,0.322558,-0.029071,-0.017862,-0.018765,-0.010794,-0.010157,-0.004212,-0.001923,-0.002589,-0.000607,-0.001983,-0.000421,-0.001835,0.003069,0.005389,0.012023,0.003422,-0.013914,-0.008548,0.007815,0.002234,0.003867,0.000488,0.000824,-0.002685,-0.000085,-0.002967,-0.000125,-0.000831,-0.000192,-0.000222,-0.003892,0.000474,-0.002069,0.001899,0.001648,-0.000490,0.001615,-0.000309,-0.000211,-0.000327,-0.000702,0.000325,-0.000152,0.000048,0.000011,0.000152,-0.000106,-0.000003,-0.000063,0.000026,-0.000104,-0.000479,-0.000528,-0.000551,-0.000202, -0.00025, -0.00020];
    // const decay = 0.6;
    // const gain = 0.3;
    // const gainRampTime = 0.3
    // const gainMethod = 'linearRampToValueAtTime';
    // const decayMethod = 'linearRampToValueAtTime';

    // bowed-string-ish sound
    const real = [0.18,0.4,0.995,0.94,0.425,0.48,0,0.365,0.04,0.085,0,0.09,0,0.0045];
    const imag = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    const decay = 1;
    const gain = 0.3;
    const gainRampTime = 0.4;
    const gainMethod = 'linearRampToValueAtTime'; // sounds like wine glasses with 'sine' (and without vibrato)!
    const decayMethod = 'exponentialRampToValueAtTime';
    vibratoFacts = [3, 0.22];
    // plucked-string - as above but:
    // const gainRampTime = 0.1
    // const gainMethod = 'exponentialRampToValueAtTime';
    // const decayMethod = 'exponentialRampToValueAtTime';

    // const imag = real.map(_ => 0);

    const customWave = context.createPeriodicWave(real,imag, {disableNormalization: true});
    oscillator.setPeriodicWave(customWave);

    const withEnv = withEnvelope(context, oscillator, decay, gain, gainRampTime, gainMethod, decayMethod);
    withEnv.connect(context.destination);

    oscillator.start(context.currentTime);

    if(vibratoFacts) {
        vibrato(context, oscillator.frequency, vibratoFacts[0], vibratoFacts[1], (lengthOfNote/2));
    }
    
    setTimeout(() => oscillator.stop(context.currentTime), lengthOfNote)
}

const playNotes = (notes, context) => {
    const timeBeforeNewNote = 500;
    const lengthOfNote = 620;
    notes.map((note, i) => {
        setTimeout(
            () => playNote(note.frequency, context, lengthOfNote),
            i * timeBeforeNewNote
    )});
}

const SoundControls = () => {
    const [notes, setNotes] = useState([]);
    const [lockedIndexes, setLocks] = useState([]);
    const context = new AudioContext()

    const handlePlay = () => {
        playNotes(notes.flat(), context);
    }

    return <Grid container spacing={2} alignContent={'center'} alignItems={'center'} justify={'center'}>
        <Grid item xs={12} >
            <SoundElementContainer setNotes={ setNotes } setLocks={ setLocks }/>
        </Grid>
        <Grid item xs={10}>
            <Typography align={'left'}>
                { notes.map((noteSegment, i) => {
                    let color;
                    switch(i % 3) {
                        case 0:
                            color = '#EF4646';
                            break;
                        case 1:
                            color = '#A2A2EF';
                            break;
                        case 2:
                        default:
                            color = '#A2EFA2';
                            break;
                    }
                    return <span key={ `text-${i}` } style={{ color }}>
                    { noteSegment.map(note =>`${note.letter}${note.modifier ? note.modifier : ''}${note.octave}`).join(' ') }&nbsp;
                </span>
                }) }
            </Typography>
        </Grid>
        <Grid item xs={10}>
            <Button color={'primary'} onClick={ handlePlay }>PLAY ➣</Button>
        </Grid>
    </Grid>;
}

export { SoundControls };