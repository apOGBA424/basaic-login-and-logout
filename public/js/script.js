

document.addEventListener('DOMContentLoaded', ()=>{
    // alert('hello');

    /*
    RESOURCE LINKS FOR CONFETTI:
    - https://github.com/catdad/canvas-confetti,
    - https://www.youtube.com/watch?v=hq_tKbSzAiY,
    - https://www.youtube.com/watch?v=fJnjFSclSXc, "❤"
    - https://www.youtube.com/watch?v=fr-e_Lb8p9M,
    */

    // Query selectors
    const button = document.querySelector('#button');
    const canvas = document.querySelector('#confetti');


    //********************** Functions**************************
    // function: 1
    function buttonClickConfetti(spreadCount, numberOfParticles){
    confetti({
        particleCount: numberOfParticles || 100,
        spread: spreadCount || 80,
        shapes: ['square','circle', 'star', 'circle', 'square'],
        origin: { y: 1 }
    });
    }

    // function: 2
    function pageLoadConfetti(){
    confetti({
        particleCount: 100,
        spread: 80,
        shapes: ['square','circle', 'star', 'circle', 'square'],
        origin: { y: 1 }
    });
    }

    // function: 3
    function fireworksConfetti(){
    var duration = 8 * 1000;  // 8 seconds
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60,   zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
        return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });}, 250);
    }
    //***************** End Of Functions  ***********************


    // ------------------ Events ---------------------
    window.addEventListener('load', () => {
    pageLoadConfetti()
    });

    button.addEventListener('click', () => {
    buttonClickConfetti();
    buttonClickConfetti(150, 200);
    fireworksConfetti();
    });
    // -------------- end of Events -----------------

})