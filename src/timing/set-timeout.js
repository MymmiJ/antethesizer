const accurateSetTimeout = (f, delay) => {
  const start = new Date().getTime();
  const loop = () => {
        const delta = new Date().getTime() - start;
        if (delta >= delay) {
            f();
            return;
        }
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
};

export default accurateSetTimeout;