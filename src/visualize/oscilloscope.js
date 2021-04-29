import React, { useState, useMemo } from 'react';
import { Button, Drawer } from "@material-ui/core";
import Canvas from './Canvas';

const Oscilloscope = ({ context, source }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(prev => !prev);
    const analyser = useMemo(() => context.createAnalyser(), [context]);
    analyser.fftSize = 1024;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    
    let draw = () => {};
    let scale = 1;
    if(source) {
        // Connect the source to be analysed
        source.connect(analyser);
            
        // draw an oscilloscope of the current audio source
        draw = (ctx, frameCount) => {
            if(source.frequency.value > 2048) {
                scale = 16;
                analyser.fftSize = 64;
            } else if(source.frequency.value > 1024) {
                scale = 8;
                analyser.fftSize = 128;
            } else if(source.frequency.value > 512) {
                scale = 4;
                analyser.fftSize = 256;
            } else {
                scale = 1;
                analyser.fftSize = 1024;
            }
            const canvas = ctx.canvas;
            analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgb(0, 255, 0)";
        
            ctx.beginPath();
        
            const sliceWidth = canvas.width * scale / bufferLength;
            let x = 0;
        
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                let y = v * canvas.height / 2;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    // Lessen impact of antialiasing artefacts
                    if(y % 1 === 0){
                        y += 0.5
                    }
                    ctx.lineTo(x, y);
                }
            
                x += sliceWidth;
            }
        
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
    }

    return <div>
        <Button onClick={toggleOpen}>OSCILLOSCOPE</Button>
        <Drawer anchor={'bottom'} variant="persistent" open={isOpen}>
                <Button onClick={() => setIsOpen(false)}>CLICK TO CLOSE</Button>
                <Canvas height={'20%'}width={'100%'} draw={ draw }/>
        </Drawer>
    </div>
}

export default Oscilloscope;