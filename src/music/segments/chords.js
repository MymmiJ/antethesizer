import { TENSION, RELEASE, EITHER, tenseMoves, releaseMoves } from './constants';
import { pick } from './index';

const chordStrategies = {
    none: {
        default: chord => chord
    },
    random: {
        withMood: ({ chord, mood, threshold = 0.5 }) => {
            let interval;
            switch(mood) {
                case TENSION:
                    interval = pick(tenseMoves);
                    break;
                case RELEASE:
                    interval = pick(releaseMoves);
                    break;
                case EITHER:
                default:
                    return chordStrategies.random.default({ chord, threshold });
            }
            if(interval === false || Math.random() < threshold) {
                return chord;
            }
            chord.addInterval(interval);
            return chord;
        },
        default: ({ chord, threshold = 0.5 }) => {
            if(Math.random() < threshold) {
                return chord;
            }
            const interval = pick([...tenseMoves, ...releaseMoves]);
            chord.addInterval(interval); // Caution: mutation!
            return chord;
        }
    }
}

export default chordStrategies;