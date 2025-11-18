document.addEventListener('DOMContentLoaded', () => {
    const fileTreeElement = document.getElementById('file-tree');
    const terminalOutputElement = document.getElementById('terminal-output');
    const marqueeContentElement = document.getElementById('marquee-content');
    const memeSlideshowElement = document.getElementById('meme-slideshow');
    const playPauseButton = document.getElementById('play-pause-button');
    const audioSpectrumElement = document.getElementById('audio-spectrum');

    // Fetch and display the file tree
    fetch('file_tree.html')
        .then(response => response.text())
        .then(html => {
            fileTreeElement.innerHTML = html;
            setupEventListeners();
        })
        .catch(error => {
            console.error('Error fetching file tree:', error);
            displayContent('Error: No se pudo cargar el arbol de archivos.');
        });

    // Fetch and display the pastas for the marquee
    fetch('pastas.html')
        .then(response => response.text())
        .then(html => {
            // Duplicate content for a seamless loop
            marqueeContentElement.innerHTML = html + html;
        })
        .catch(error => {
            console.error('Error fetching pastas:', error);
            marqueeContentElement.innerHTML = '<div>Error: No se pudo cargar los pastas.</div>';
        });

    function setupEventListeners() {
        fileTreeElement.addEventListener('click', (event) => {
            const target = event.target;

            if (target.classList.contains('folder')) {
                const folderContent = target.querySelector('.folder-content');
                if (folderContent) {
                    folderContent.classList.toggle('hidden');
                }
            } else if (target.classList.contains('file')) {
                const content = target.dataset.content;
                if (content) {
                    displayContent(content);
                }
            }
        });
    }

    function displayContent(content) {
        // Clear previous content
        terminalOutputElement.innerHTML = '';

        terminalOutputElement.innerHTML = `<pre>${content}</pre>`;

        terminalOutputElement.scrollTop = 0; // Scroll to top
    }

    // Set initial message
    displayContent('Emilio es la respuesta natural a la desintregración causada por tanta división, propaganda y corrupción.\n\nPero antes que nada, Emilio es argentino.\n\nEsta Wiki es un intento de recopilar el lore del emilismo y sus afluentes.\n\nEspero que la disfrutes anon.\n\nCon cariño,\nEmilio.');

    // Pill logic
    const redPill = document.getElementById('red-pill');
    const bluePill = document.getElementById('blue-pill');

    const redPillLinks = [
        'https://x.com/emiliocrafteom',
        'https://github.com/elieltruc/miyapill',
	'https://maker.emilio.lol/',
	'https://youtu.be/BXlLqA2cj4s',
	'https://youtu.be/g-MBejztvF4',
	'https://www.youtube.com/watch?v=Vgt_LQdBmz8',
	'https://www.youtube.com/watch?v=aRFRMEtEgDM',
	'https://x.com/LaImprentaInc'
    ];

    const bluePillLinks = [
        'https://crecimiento.build/',
	'https://aleph.crecimiento.build/'
    ];

    redPill.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * redPillLinks.length);
        window.open(redPillLinks[randomIndex], '_blank');
    });

    bluePill.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * bluePillLinks.length);
        window.open(bluePillLinks[randomIndex], '_blank');
    });

    // Meme Slideshow Logic
    let memeFiles = [];
    let currentMemeIndex = 0;
    const memeImg1 = document.createElement('img');
    const memeImg2 = document.createElement('img');
    memeSlideshowElement.appendChild(memeImg1);
    memeSlideshowElement.appendChild(memeImg2);
    let activeImg = memeImg1;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    fetch('media/memes.json')
        .then(response => response.json())
        .then(data => {
            memeFiles = data;
            shuffle(memeFiles);
            if (memeFiles.length > 0) {
                memeImg1.src = memeFiles[0];
                memeImg1.classList.add('active');
                setInterval(changeMeme, 3000);
            }
        })
        .catch(error => console.error('Error fetching memes:', error));

    function changeMeme() {
        currentMemeIndex = (currentMemeIndex + 1) % memeFiles.length;
        const nextImg = activeImg === memeImg1 ? memeImg2 : memeImg1;
        nextImg.src = memeFiles[currentMemeIndex];
        activeImg.classList.remove('active');
        nextImg.classList.add('active');
        activeImg = nextImg;
    }

    // Audio Player Logic
    let audioFiles = [];
    let currentAudioIndex = 0; // Keep track of the next audio to play
    const audio = new Audio();
    let isPlaying = false;

    for (let i = 0; i < 12; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        audioSpectrumElement.appendChild(bar);
    }

    fetch('media/audios.json')
        .then(response => response.json())
        .then(data => {
            audioFiles = data;
            shuffle(audioFiles); // Shuffle the array on load
        })
        .catch(error => console.error('Error fetching audios:', error));

    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playPauseButton.classList.remove('pause');
            playPauseButton.classList.add('play');
            audioSpectrumElement.classList.remove('playing');
        } else {
            if (audioFiles.length > 0) {
                // If we've played all songs, reshuffle and start from the beginning
                if (currentAudioIndex >= audioFiles.length) {
                    currentAudioIndex = 0;
                    shuffle(audioFiles);
                }
                
                audio.src = audioFiles[currentAudioIndex];
                currentAudioIndex++; // Move to the next song for the next click
                
                audio.play();
                isPlaying = true;
                playPauseButton.classList.remove('play');
                playPauseButton.classList.add('pause');
                audioSpectrumElement.classList.add('playing');
            }
        }
    });

    audio.addEventListener('ended', () => {
        isPlaying = false;
        playPauseButton.classList.remove('pause');
        playPauseButton.classList.add('play');
        audioSpectrumElement.classList.remove('playing');
    });
});
