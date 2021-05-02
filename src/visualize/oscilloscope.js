import React, { useState, useMemo } from 'react';
import { Box, Button, Drawer, Grid } from "@material-ui/core";
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
            
        // draw an oscilloscope of the current audio source
        draw = (ctx, frameCount) => {
            const canvas = ctx.canvas;
            analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgb(0, 255, 0)";
        
            ctx.beginPath();
        
            const sliceWidth = canvas.width * scale / bufferLength;
            let x = 0;
        
            for (let i = 0; i < bufferLength; ++i) {
                const v = dataArray[i] / 128.0;
                let y = v * canvas.height / 2;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            
                x += sliceWidth;
            }
        
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
    }

    return <Box boxShadow={3}>
        <Button color={'secondary'} variant="contained" onClick={toggleOpen}>OSCILLOSCOPE</Button>
        <Drawer anchor={'bottom'} variant="persistent" open={isOpen}>
            <Box boxShadow={3}>
                <Grid container spacing={1} alignContent={'flex-start'} alignItems={'flex-start'} justify={'space-between'}>
                    <Grid item xs={2}>
                        <Button disabled={true}>SCALE: { scale }x</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color={'primary'}
                            onClick={() => setIsOpen(false)}>
                                CLOSE
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Canvas height={'50px'} draw={ draw }/>
        </Drawer>
    </Box>
}

export default Oscilloscope;