const alterVoicings = (noteArray, voicedOptions, strategy = false) => {
    const rootNote = noteArray[0];
    return noteArray.map(
        note => {
            const canAlterVoice = voicedOptions.reduce((acc, curr) => {
                const currentNote = curr;
                currentNote.octave = rootNote.octave;
                return rootNote.interval(curr).letter === note.letter;
            },
            false);
            if(!canAlterVoice) {
                return note;
            }
            const maybeAlteredNote = strategy ? strategy(note, rootNote.octave) : randomStrategy(note, rootNote.octave);
            return maybeAlteredNote
        }
    );
};
// Note: using this will normalize qualifying notes to within 1 octave of the root.
// If voicedOptions is narrow, this may have unexpected effects on longer passages.
// This is primarily intended for usage with chords & arpeggios.
const randomStrategy = (note, rootOctave) => {
    const rnd = Math.random();
    if(rnd < 0.4) {
        note.octave = rootOctave - 1;
    } else if (rnd < 0.8) {
        note.octave = rootOctave;
    } else {
        note.octave = rootOctave + 1;
    }
    return note;
}

export default alterVoicings;