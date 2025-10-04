const rotatingDiv = document.getElementById('main');
const container = document.querySelector('.container');
const playBtn = document.getElementById('playBtn');

fetch('https://ipwho.is/')
  .then(res => res.json())
  .then(data => {
    playBtn.textContent = `Welcome Back \nNice to see someone from ${data.city}, ${data.country}.\n\nClick to access to my personal page.\n\n #Equipe404`;
  });

function updateRotation(e) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const maxRotation = 10; 
    const rotateX = (mouseY / (rect.height / 2)) * -maxRotation;
    const rotateY = (mouseX / (rect.width / 2)) * maxRotation;
    
    rotatingDiv.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(20px)
    `;
}

function resetRotation() {
    rotatingDiv.style.transform = `
        rotateX(0deg)
        rotateY(0deg)
        translateZ(0px)
    `;
}

/* --- hover effect disabled ---
rotatingDiv.addEventListener('mouseenter', function() {
    rotatingDiv.style.transition = 'none'; 
    document.addEventListener('mousemove', updateRotation);
});

rotatingDiv.addEventListener('mouseleave', function() {
    rotatingDiv.style.transition = 'transform 0.6s ease'; 
    document.removeEventListener('mousemove', updateRotation);
    resetRotation();
});
--- end disable --- */

const startScreen = document.getElementById('start-screen');

startScreen.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    const audio = document.getElementById("audio");
    const currentTimeSpan = document.getElementById('currentTime');
    const totalTimeSpan = document.getElementById('totalTime');

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    audio.play().catch((err) => {
        console.error("erreur:", err);
        alert("erreur");
    });

    audio.addEventListener('error', function(e) {
        console.error("erreur sur la musique", e);
    });
    audio.addEventListener('timeupdate', function() {
        const currentTime = audio.currentTime;
        currentTimeSpan.textContent = formatTime(currentTime);
    });

});

const discordBtn = document.getElementById('discord-btn');
const textToCopy = 'kts';

if (discordBtn) {
  discordBtn.addEventListener('click', function(e) {
    e.preventDefault();
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Username copied to clipboard!');
      })
      .catch(() => {
        alert('Copy failed!\nUsername: kts');
      });
  });
}

// --- Slider volume ---
(function(){
  const audio = document.getElementById('audio');
  const slider = document.getElementById('vol');
  if (!audio || !slider) return;

  const getPct = () => {
    const saved = localStorage.getItem('volumePct');
    return saved !== null ? +saved : +slider.value || 60;
  };

  function apply(pct){
    const v = Math.min(1, Math.max(0, pct/100));
    audio.muted = false;
    audio.volume = v;
  }

  // init
  const startPct = getPct();
  slider.value = startPct;
  apply(startPct);

  // live update
  slider.addEventListener('input', e => {
    const pct = +e.target.value;
    apply(pct);
    localStorage.setItem('volumePct', pct);
  });

  // réappliquer après le premier geste si l’autoplay a été bloqué
  document.addEventListener('click', () => {
    apply(+slider.value);
  }, { once:true });

  // afficher la durée totale quand dispo
  const totalTimeSpan = document.getElementById('totalTime');
  if (totalTimeSpan) {
    const fmt = seconds => {
      const m = Math.floor(seconds/60);
      const s = Math.floor(seconds%60);
      return `${m}:${s<10?'0':''}${s}`;
    };
    if (!isNaN(audio.duration)) totalTimeSpan.textContent = fmt(audio.duration);
    audio.addEventListener('loadedmetadata', () => {
      if (!isNaN(audio.duration)) totalTimeSpan.textContent = fmt(audio.duration);
    });
  }
})();
