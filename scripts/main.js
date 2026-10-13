document.addEventListener('DOMContentLoaded', () => {
    const textContainer = document.getElementById('text-container');
    const clickableText = document.getElementById('clickable-text');
    const bgImage = document.getElementById('bg-image');
    const rainVideo = document.getElementById('rain-overlay');
    const arrowBtn = document.getElementById('arrow-btn');
    const paperBtn = document.getElementById('paper-btn');
    
    const rainAudio = new Audio('resources/audio/rain.wav');
    const footstepsAudio = new Audio('resources/audio/steps.wav');

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // quando o texto terminar de aparecer, ele pode ser clicado
    clickableText.addEventListener('animationend', () => {
        clickableText.classList.add('ready');
    });
    

    // POSICIONAMENTO DA SETA CORRETAMENTE NA TELA
    const IMG_WIDTH = 1920;
    const IMG_HEIGHT = 940;

    const scenes = [ 
        { // parametros da tela 1
            bg: 'resources/backgrounds/cemetery-0.png',
            arrowTargetX: 0.50, 
            arrowTargetY: 0.55, 
            arrowWidth: 250,
            rotX: '60deg',
            rotZ: '15deg'
        },
        { // parametros da tela 2
            bg: 'resources/backgrounds/cemetery-1.png',
            arrowTargetX: 0.25,
            arrowTargetY: 0.62,
            arrowWidth: 175,
            rotX: '70deg',
            rotZ: '-15deg'
        }, 
        { // parametros da tela 3
            bg: 'resources/backgrounds/cemetery-2.png',
            arrowTargetX: 0.42, 
            arrowTargetY: 0.48, 
            arrowWidth: 300,
            rotX: '80deg',
            rotZ: '3deg'
        }, 
        { // parametros da tela 4 (sem seta, com papel)
            bg: 'resources/backgrounds/cemetery-3.png',
            hasArrow: false,
            hasPaper: true,
            paperTargetX: 0.48, 
            paperTargetY: 0.40, 
            paperWidth: 180
        }
    ];

    let currentSceneIndex = 0;

    function updateArrowPosition() {
        const currentScene = scenes[currentSceneIndex];
        if (!currentScene || currentScene.hasArrow === false) return;

        // rotação da seta
        arrowBtn.style.setProperty('--rot-x', currentScene.rotX || '0deg');
        arrowBtn.style.setProperty('--rot-z', currentScene.rotZ || '0deg');
        
        // redimensionamento e reposição da seta para a posição correta na tela
        // mesmo se a tela for de tamanho diferente/for redimensionada
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const imgRatio = IMG_WIDTH / IMG_HEIGHT;
        const windowRatio = windowWidth / windowHeight;

        let renderWidth, renderHeight;

        if (windowRatio > imgRatio) {
            renderWidth = windowWidth;
            renderHeight = windowWidth / imgRatio;
        } else {
            renderHeight = windowHeight;
            renderWidth = windowHeight * imgRatio;
        }

        const offsetX = (windowWidth - renderWidth) / 2;
        const offsetY = (windowHeight - renderHeight) / 2;

        const scale = renderWidth / IMG_WIDTH;

        console.log(scale);

        const currentWidth = currentScene.arrowWidth * scale;
        const aspect = (arrowBtn.naturalWidth && arrowBtn.naturalHeight) 
            ? (arrowBtn.naturalHeight / arrowBtn.naturalWidth) 
            : 1;
        const currentHeight = currentWidth * aspect;

        const arrowX = offsetX + (renderWidth * currentScene.arrowTargetX);
        const arrowY = offsetY + (renderHeight * currentScene.arrowTargetY);

        arrowBtn.style.width = `${currentWidth}px`;
        arrowBtn.style.height = `${currentHeight}px`;
        arrowBtn.style.left = `${arrowX}px`;
        arrowBtn.style.top = `${arrowY}px`;
    }

    function updatePaperPosition() {
        const currentScene = scenes[currentSceneIndex];
        if (!currentScene || !currentScene.hasPaper) return;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const imgRatio = IMG_WIDTH / IMG_HEIGHT;
        const windowRatio = windowWidth / windowHeight;

        let renderWidth, renderHeight;

        if (windowRatio > imgRatio) {
            renderWidth = windowWidth;
            renderHeight = windowWidth / imgRatio;
        } else {
            renderHeight = windowHeight;
            renderWidth = windowHeight * imgRatio;
        }

        const offsetX = (windowWidth - renderWidth) / 2;
        const offsetY = (windowHeight - renderHeight) / 2;

        const scale = renderWidth / IMG_WIDTH;

        const currentWidth = currentScene.paperWidth * scale;
        const aspect = (paperBtn.naturalWidth && paperBtn.naturalHeight) 
            ? (paperBtn.naturalHeight / paperBtn.naturalWidth) 
            : 1;
        const currentHeight = currentWidth * aspect;

        const paperX = offsetX + (renderWidth * currentScene.paperTargetX);
        const paperY = offsetY + (renderHeight * currentScene.paperTargetY);

        paperBtn.style.width = `${currentWidth}px`;
        paperBtn.style.height = `${currentHeight}px`;
        paperBtn.style.left = `${paperX}px`;
        paperBtn.style.top = `${paperY}px`;
    }

    window.addEventListener('resize', () => {
        updateArrowPosition();
        updatePaperPosition();
    });
    updateArrowPosition();

    // AUDIO E TRANSIÇÃO DE TELAS
    rainAudio.loop = true;
    rainAudio.volume = 0.7;
    
    footstepsAudio.loop = false;
    footstepsAudio.volume = 0.8;
    
    let hasClicked = false;
    let blinkTimer = null;

    function scheduleArrowPulse() {
        if (blinkTimer) clearTimeout(blinkTimer);
        blinkTimer = setTimeout(() => {
            if (arrowBtn.classList.contains('visible')) {
                arrowBtn.classList.add('blink');
            }
        }, 7500);
    }

    clickableText.addEventListener('click', async () => {
        if (hasClicked) return;
        hasClicked = true;

        // fade out do texto
        textContainer.classList.add('fade-out');

        // chuva com delay
        await wait(1750);
        rainAudio.play().catch(e => console.log(e));

        if (rainVideo) {
            rainVideo.play().catch(e => console.log(e));
            rainVideo.classList.add('fade-in');
        }

        // passos com delay
        await wait(4000);
        footstepsAudio.play().catch(e => console.log(e));

        // fundo com delay
        await wait(2000);
        bgImage.classList.add('fade-in');

        await wait(3000);
        updateArrowPosition();
        arrowBtn.classList.add('visible');

        scheduleArrowPulse();
    });

    arrowBtn.addEventListener('click', async () => {
        if (blinkTimer) clearTimeout(blinkTimer);

        arrowBtn.classList.remove('visible', 'blink');
        await wait(500);
        bgImage.classList.remove('fade-in');

        await wait(2750);
        footstepsAudio.currentTime = 0; 
        footstepsAudio.play().catch(e => console.log(e));

        await wait(2000);
        currentSceneIndex++;
        const nextScene = scenes[currentSceneIndex];

        if (nextScene) {
            bgImage.style.backgroundImage = `url('${nextScene.bg}')`;

            await wait(500);
            bgImage.classList.add('fade-in');

            if (nextScene.hasArrow !== false) {
                updateArrowPosition();

                await wait(3000);
                arrowBtn.classList.add('visible');
                
                scheduleArrowPulse();
            }

            if (nextScene.hasPaper) {
                updatePaperPosition();

                await wait(2000); 
                paperBtn.classList.add('visible');

                blinkTimer = setTimeout(() => {
                    if (paperBtn.classList.contains('visible')) {
                        paperBtn.classList.add('blink');
                    }
                }, 7500);
            }
        }
        
    });

    function fadeOutAudio(audio, duration = 2000) {
        return new Promise((resolve) => {
            const startVolume = audio.volume;
            const interval = 50; 
            const steps = duration / interval;
            const stepAmount = startVolume / steps;

            const fadeInterval = setInterval(() => {
                if (audio.volume - stepAmount > 0) {
                    audio.volume -= stepAmount;
                } else {
                    audio.volume = 0;
                    audio.pause(); 
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, interval);
        });
    }

    paperBtn.addEventListener('click', async () => {
        if (blinkTimer) clearTimeout(blinkTimer);

        paperBtn.classList.remove('visible', 'blink');
        await wait(2000);
        bgImage.classList.remove('fade-in');

        await Promise.all([
            fadeOutAudio(rainAudio, 4000),
            wait(5500)
        ]);
        window.location.href = 'htmls/invitation.html';
    });

});