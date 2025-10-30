document.addEventListener('DOMContentLoaded', () => {
    const fileTreeElement = document.getElementById('file-tree');
    const terminalOutputElement = document.getElementById('terminal-output');
    const marqueeContentElement = document.getElementById('marquee-content');

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
    displayContent('EOM');

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
	'https://www.youtube.com/watch?v=aRFRMEtEgDM'
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
});
