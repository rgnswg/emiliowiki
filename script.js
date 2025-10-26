document.addEventListener('DOMContentLoaded', () => {
    const fileTreeElement = document.getElementById('file-tree');
    const terminalOutputElement = document.getElementById('terminal-output');

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
    displayContent('Bienvenido a la Wiki NFT. Selecciona un trait del explorador.');
});