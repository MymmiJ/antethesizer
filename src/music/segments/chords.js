import { TENSION, RELEASE, EITHER, tenseMoves, releaseMoves, octaveMoves } from './constants';
import { Note, Chord } from 'octavian';
import { pick } from './index';

const gospel9 = chord => {
    // Move 'root' down to major Seventh below
    const chordRoot = new Note(chord.signatures[0]);
    const seventhBase = chordRoot.downOctave().majorSeventh().toChord();
    // From the major, so this is just 1-3-5-7-9 voiced dramatically
    return seventhBase // 7
        .addInterval('minorSecond') // 1
        .addInterval('minorThird') // 9
        .addInterval('perfectFourth') // 3
        .addInterval('minorSixth') // 5
}

const chordStrategies = {
    none: {
        default: () => chord => chord
    },
    random: {
        "with mood": ({ mood, threshold = 0.2, maxStack, minStack, chanceFalloff = 0 }) => chord => {
            let interval;
            switch(mood) {
                case TENSION:
                    interval = pick(tenseMoves);
                    break;
                case RELEASE:
                    interval = pick([...releaseMoves, 'perfectOctave']);
                    break;
                case EITHER:
                default:
                    return chordStrategies.random.default({
                        threshold: threshold-chanceFalloff, chanceFalloff, maxStack, minStack })(chord);
            }
            if(interval === false) {
                interval = pick(octaveMoves);
            }
            if(Math.random() > threshold && minStack <= 0) {
                return chord;
            } else {
                if(maxStack <= 0) {
                    return chord;
                }
                chord.addInterval(interval);
                return chordStrategies.random['with mood']({
                    mood, threshold: threshold-chanceFalloff, chanceFalloff,
                    maxStack: maxStack-1,
                    minStack: minStack-1 })(chord);
            }
        },
        default: ({ threshold = 0.2, maxStack, minStack, chanceFalloff }) => chord => {
            if(Math.random() > threshold && minStack <= 0) {
                return chord;
            } else {
                if(maxStack <= 0) {
                    return chord;
                }
                let interval = pick([...tenseMoves, ...releaseMoves, ...octaveMoves]);
                if(interval === false) {
                    interval = pick(octaveMoves);
                }
                chord.addInterval(interval); // Caution: mutation!
                return chordStrategies.random.default({
                    threshold: threshold-chanceFalloff, chanceFalloff,
                    maxStack: maxStack-1,
                    minStack: minStack-1 })(chord);
            }
        }
    }
}

const getStrategy = strategy => {
    if(typeof strategy === 'string') {
        strategy = strategy.split(',');
    }
    if(Array.isArray(strategy)) {
        let objectPath = chordStrategies;
        strategy.forEach(path => {
            objectPath = objectPath[path];
        })
        strategy = objectPath;
    }
    return strategy;
}

const defaultChordOptions = {
    threshold: 0.2,
    maxStack: 3,
    minStack: 0,
    chanceFalloff: 0
}

export { getStrategy, defaultChordOptions };
export default chordStrategies;