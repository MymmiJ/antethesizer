import { ifft } from 'fft-js';

const getFloatsFromString = str => str.split(',').map(parseFloat);

const nearestPowerOf2 = size => 1 << 32 - Math.clz32(size);

const mapToPhasors = (real, imag) => {
    if(!real) {
        real = [];
    }
    if(!imag) {
        imag = new Array(real.length).fill(0);
    }

    if(typeof real === 'string') {
        real = getFloatsFromString(real);
    }
    if(typeof imag === 'string') {
        imag = getFloatsFromString(imag);
    }

    const nearestPower = nearestPowerOf2(real.length);

    if(nearestPower > real.length) {
        real = [...real, ...(new Array(nearestPower - real.length).fill(0))]
    }
    
    if(imag.length < real.length) {
        imag = [...imag, ...(new Array(real.length - imag.length).fill(0))];
    } else if(imag.length > real.length) {
        imag = imag.slice(0,real.length);
    }
    const phasors = real.map((r, i) => {
        return [r, imag[i]];
    });
    return phasors;
};

const inverseFFT = (real, imag) => {
    const phasors = mapToPhasors(real, imag);
    try {
        return ifft(phasors);
    } catch(error) {
        console.warn(error);
        return [];
    }
}

export { inverseFFT };