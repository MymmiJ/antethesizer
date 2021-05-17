const SegmentNoteDisplay = ({ notes }) =>
    <div align={'left'} style={{ fontSize: '1.2em' }}>{ notes.map((chords, i) => {
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
        return <div style={{ display: 'inline' }} key={ `notes-div-${i}` }>
            <span key={ `text-${i}` } style={{ color }}>
            { chords.map(chord => {
                if(chord.notes.length > 1) {
                    return `[${ chord.notes.map(note => `${note.letter}${note.modifier ? note.modifier : ''}${note.octave}`) }] `
                }
                const note = chord.notes[0];
                return `${note.letter}${note.modifier ? note.modifier : ''}${note.octave}`
            }).join(' ') }&nbsp;
        </span>
        </div>;
        }) }
    </div>;

export default SegmentNoteDisplay;