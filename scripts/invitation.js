document.addEventListener('DOMContentLoaded', () => {
    const floatingPaper = document.getElementById('floating-paper');
    const paperWrapper = document.getElementById('paper-wrapper');
    const bgImage = document.getElementById('bg-image');
    const textContainer = document.getElementById('text-container');
    const textLines = document.querySelectorAll('.text-line');
    const clickableLine = document.getElementById('clickable-line');

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const organAudio = new Audio('../resources/audio/organ-music.wav');
    organAudio.loop = true;
    organAudio.volume = 0.7;

    setTimeout(() => {
        if (floatingPaper) {
            floatingPaper.classList.add('visible');
        }
    }, 1000);

    if (floatingPaper) {
        floatingPaper.addEventListener('click', async () => {
            const computedStyle = window.getComputedStyle(floatingPaper);
            const currentTransform = computedStyle.transform;

            floatingPaper.style.animation = 'none';
            floatingPaper.style.transform = currentTransform;

            void floatingPaper.offsetHeight;

            floatingPaper.style.transition = 'opacity 0.75s ease-in-out, transform 0.75s ease-in-out';
            floatingPaper.style.opacity = '0';
            floatingPaper.style.transform = `${currentTransform} scale(1.2)`;
            floatingPaper.style.pointerEvents = 'none';

            if (paperWrapper) {
                paperWrapper.style.display = 'none';
            }
            if (bgImage) {
                bgImage.classList.add('visible');
            }

            if (textContainer) {
                textContainer.classList.add('active');
            }

            await wait(2500);
            organAudio.play().catch(e => console.log(e));

            let delayTotal = 1000;
            textLines.forEach((line) => {
                const delay = parseInt(line.dataset.delay, 10) || 1000;
                delayTotal += delay;

                setTimeout(() => {
                    line.classList.add('visible');
                }, delayTotal);
            });
        });
    }

    if (clickableLine) {
        clickableLine.addEventListener('click', () => {
            window.location.href = "https://wa.me//5591989175425?text=confirmo minha presença dia 31/10 𓉸";
        });
    }
});
