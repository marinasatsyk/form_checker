document.addEventListener("DOMContentLoaded", () => {
    console.log("scripts.js loaded and DOM content loaded");

    // Conteneur pour afficher les fichiers ajoutés
    const fileListContainer = document.getElementById("file-list-container");
    const fileDropContainer = document.getElementById("file-drop-container");
    const fileInput = document.getElementById("file-input");
    const fileOrder = document.getElementById("file-order");

    // Tableau pour stocker l'ordre des fichiers
    const filesArray = [];

    // Fonction pour afficher les fichiers ajoutés avec les boutons "monter" et "descendre"
    function renderFileList() {
        // Vider le conteneur actuel
        fileListContainer.innerHTML = '';

        if (filesArray.length === 0) {
            fileListContainer.innerHTML = '<p>Aucun fichier ajouté</p>';
        } else {
            // Créer une liste d'éléments avec boutons pour chaque fichier
            filesArray.forEach((file, index) => {
                const fileWrapper = document.createElement('div');
                fileWrapper.style.marginBottom = '10px';
                
                const fileName = document.createElement('span');
                fileName.textContent = file.name;
                fileWrapper.appendChild(fileName);

                // Bouton pour monter
                const upButton = document.createElement('button');
                upButton.textContent = 'Monter';
                upButton.disabled = index === 0; // Désactiver le bouton "monter" si c'est déjà le premier fichier
                upButton.addEventListener('click', () => moveFileUp(index));
                fileWrapper.appendChild(upButton);

                // Bouton pour descendre
                const downButton = document.createElement('button');
                downButton.textContent = 'Descendre';
                downButton.disabled = index === filesArray.length - 1; // Désactiver le bouton "descendre" si c'est déjà le dernier fichier
                downButton.addEventListener('click', () => moveFileDown(index));
                fileWrapper.appendChild(downButton);

                fileListContainer.appendChild(fileWrapper);
            });
        }

        // Mettre à jour l'ordre des fichiers dans le champ caché
        fileOrder.value = JSON.stringify(filesArray.map(f => f.name));
        console.log("Updated file order:", filesArray.map(f => f.name));
    }

    // Fonction pour déplacer un fichier vers le haut
    function moveFileUp(index) {
        if (index > 0) {
            const file = filesArray[index];
            filesArray.splice(index, 1); // Retirer le fichier de la position actuelle
            filesArray.splice(index - 1, 0, file); // Insérer le fichier à la nouvelle position

            renderFileList(); // Re-rendre la liste des fichiers
        }
    }

    // Fonction pour déplacer un fichier vers le bas
    function moveFileDown(index) {
        if (index < filesArray.length - 1) {
            const file = filesArray[index];
            filesArray.splice(index, 1); // Retirer le fichier de la position actuelle
            filesArray.splice(index + 1, 0, file); // Insérer le fichier à la nouvelle position

            renderFileList(); // Re-rendre la liste des fichiers
        }
    }

    // Suivre l'ordre des fichiers lors du drag and drop
    fileDropContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
        fileDropContainer.style.backgroundColor = "#e9e9e9"; // Indiquer qu'on peut déposer des fichiers
    });

    fileDropContainer.addEventListener("dragleave", (event) => {
        event.preventDefault();
        fileDropContainer.style.backgroundColor = "#fff"; // Rétablir la couleur
    });

    fileDropContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        fileDropContainer.style.backgroundColor = "#fff"; // Rétablir la couleur

        // Récupérer les fichiers déposés
        const droppedFiles = Array.from(event.dataTransfer.files);
        console.log("Dropped files:", droppedFiles);

        // Ajouter les fichiers dans l'ordre et réafficher la liste
        droppedFiles.forEach(file => filesArray.push(file));
        renderFileList(); // Mettre à jour l'affichage des fichiers
    });

    // Si vous avez un input file caché pour permettre un ajout classique de fichiers
    fileInput.addEventListener("change", (event) => {
        const selectedFiles = Array.from(fileInput.files);
        console.log("Files selected:", selectedFiles);

        // Ajouter les fichiers dans l'ordre et réafficher la liste
        selectedFiles.forEach(file => filesArray.push(file));
        renderFileList(); // Mettre à jour l'affichage des fichiers
    });

    // Ouvrir le file input lorsqu'on clique sur le container
    fileDropContainer.addEventListener("click", () => {
        fileInput.click();
    });
});
