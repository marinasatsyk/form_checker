document.addEventListener("DOMContentLoaded", () => {
    console.log("scripts.js loaded and DOM content loaded");

    // Conteneur pour afficher les fichiers ajoutés avec leurs aperçus
    const fileDropContainer = document.getElementById("file-drop-container");
    const fileInput = document.getElementById("file-input");
    const fileOrder = document.getElementById("file-order");
    const imagePreviewsContainer = document.getElementById("image-previews");

    // Tableau pour stocker les fichiers dans l'ordre d'ajout
    const filesArray = [];

    // Fonction pour afficher les fichiers ajoutés avec leurs aperçus
    function renderFileList() {
        imagePreviewsContainer.innerHTML = ''; // Vider le conteneur d'aperçus d'images

        if (filesArray.length === 0) {
            imagePreviewsContainer.innerHTML = '<p>Aucun fichier ajouté</p>';
        } else {
            // Créer une liste de prévisualisations pour chaque fichier
            filesArray.forEach((file, index) => {
                // Conteneur pour chaque fichier et son aperçu
                const fileWrapper = document.createElement('div');
                fileWrapper.style.display = 'flex';
                fileWrapper.style.alignItems = 'center';
                fileWrapper.style.marginBottom = '10px';

                // Créer un aperçu de l'image
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.width = '100px'; // Vous pouvez ajuster la taille de l'aperçu
                    img.style.marginRight = '10px';
                    img.style.cursor = 'pointer';

                    // Ajouter l'aperçu à son conteneur
                    fileWrapper.appendChild(img);
                };
                reader.readAsDataURL(file); // Lire le fichier image pour l'aperçu

                // Afficher le nom du fichier
                const fileName = document.createElement('span');
                fileName.textContent = file.name;
                fileWrapper.appendChild(fileName);

                // Boutons pour déplacer l'image
                const upButton = document.createElement('button');
                upButton.textContent = 'Monter';
                upButton.disabled = index === 0; // Désactiver si c'est déjà le premier fichier
                upButton.addEventListener('click', () => moveFileUp(index));
                fileWrapper.appendChild(upButton);

                const downButton = document.createElement('button');
                downButton.textContent = 'Descendre';
                downButton.disabled = index === filesArray.length - 1; // Désactiver si c'est déjà le dernier fichier
                downButton.addEventListener('click', () => moveFileDown(index));
                fileWrapper.appendChild(downButton);

                // Ajouter le conteneur du fichier à l'affichage
                imagePreviewsContainer.appendChild(fileWrapper);
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
            filesArray.splice(index, 1);
            filesArray.splice(index - 1, 0, file);
            renderFileList();
        }
    }

    // Fonction pour déplacer un fichier vers le bas
    function moveFileDown(index) {
        if (index < filesArray.length - 1) {
            const file = filesArray[index];
            filesArray.splice(index, 1);
            filesArray.splice(index + 1, 0, file);
            renderFileList();
        }
    }

    // Gérer l'événement dragover pour permettre le drop
    fileDropContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
        fileDropContainer.style.backgroundColor = "#e9e9e9";
    });

    // Gérer l'événement dragleave pour rétablir le style
    fileDropContainer.addEventListener("dragleave", (event) => {
        event.preventDefault();
        fileDropContainer.style.backgroundColor = "#fff";
    });

    // Lorsque les fichiers sont déposés dans la zone de drop
    fileDropContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        fileDropContainer.style.backgroundColor = "#fff";

        const droppedFiles = Array.from(event.dataTransfer.files);
        console.log("Dropped files:", droppedFiles);

        // Ajouter les fichiers au tableau
        droppedFiles.forEach(file => filesArray.push(file));
        renderFileList();
    });

    // Lorsque l'utilisateur sélectionne des fichiers via le champ input
    fileInput.addEventListener("change", (event) => {
        const selectedFiles = Array.from(fileInput.files);
        console.log("Files selected:", selectedFiles);

        // Ajouter les fichiers au tableau
        selectedFiles.forEach(file => filesArray.push(file));
        renderFileList();
    });

    // Ouvrir l'input file lorsqu'on clique sur le conteneur
    fileDropContainer.addEventListener("click", () => {
        fileInput.click();
    });
});
