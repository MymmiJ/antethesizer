const startOscillator = () => {
    oscillator.start(context.currentTime)
    setTimeout(() => oscillator.stop(context.currentTime), 1000)
}

const SoundButton = () => {
    const context = new AudioContext()
    const oscillator = context.createOscillator()

    oscillator.frequency.value = 440
    oscillator.type = 'sine'
    oscillator.connect(context.destination)

    return <button onClick={ startOscillator } />;
}

export { SoundButton };