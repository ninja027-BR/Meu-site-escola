document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const contentArea = document.getElementById('content-area');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contentId = button.dataset.content;

            // Fade out the current content
            contentArea.style.opacity = 0;

            setTimeout(() => {
                // Hide all content sections
                contentSections.forEach(section => {
                    section.style.display = 'none';
                });

                // Show the selected content section
                const activeSection = document.getElementById(`${contentId}-content`);
                if (activeSection) {
                    activeSection.style.display = 'block';
                }

                // Fade in the new content
                contentArea.style.opacity = 1;
            }, 300); // Match this to the transition time

            // Update active state of buttons
            navButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    // Show the home content by default
    document.getElementById('home-content').style.display = 'block';
    // Initial fade-in for the main content
    setTimeout(() => {
        contentArea.style.opacity = 1;
    }, 100);
});
document.addEventListener('DOMContentLoaded', () => {
    // Seletores de elementos
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const contentArea = document.getElementById('content-area');
    
    const topicSelector = document.getElementById('topic-selector');
    const contentEditor = document.getElementById('content-editor');
    const saveButton = document.getElementById('save-button');
    const saveStatus = document.getElementById('save-status');

    // Mapeamento dos IDs dos parágrafos de conteúdo
    const contentParagraphIds = ['home', 'animais', 'corais', 'esponjas', 'wiki'];

    // --- LÓGICA DE NAVEGAÇÃO ENTRE ABAS ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contentId = button.dataset.content;

            contentArea.style.opacity = 0;
            setTimeout(() => {
                contentSections.forEach(section => section.style.display = 'none');
                const activeSection = document.getElementById(`${contentId}-content`);
                if (activeSection) activeSection.style.display = 'block';
                contentArea.style.opacity = 1;

                // Se a aba de gerenciamento for aberta, atualiza o editor
                if (contentId === 'gerenciar') {
                    updateEditor();
                }
            }, 300);

            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // --- LÓGICA DO EDITOR DE CONTEÚDO ---

    // 1. Carregar conteúdo salvo do localStorage ao iniciar
    function loadContentFromStorage() {
        contentParagraphIds.forEach(id => {
            const savedText = localStorage.getItem(`p-${id}`);
            if (savedText) {
                document.getElementById(`p-${id}`).innerText = savedText;
            }
        });
    }

    // 2. Atualizar a caixa de texto do editor com base na seleção
    function updateEditor() {
        const selectedTopicId = topicSelector.value;
        const paragraphElement = document.getElementById(`p-${selectedTopicId}`);
        if (paragraphElement) {
            contentEditor.value = paragraphElement.innerText;
        }
    }

    // 3. Salvar o conteúdo
    function saveContent() {
        const selectedTopicId = topicSelector.value;
        const newText = contentEditor.value;

        // Atualiza o parágrafo na página
        document.getElementById(`p-${selectedTopicId}`).innerText = newText;
        
        // Salva no localStorage
        localStorage.setItem(`p-${selectedTopicId}`, newText);

        // Feedback visual para o usuário
        saveStatus.innerText = 'Conteúdo salvo com sucesso!';
        setTimeout(() => {
            saveStatus.innerText = '';
        }, 3000); // Limpa a mensagem após 3 segundos
    }

    // --- EVENT LISTENERS DO EDITOR ---
    if (topicSelector && contentEditor && saveButton) {
        topicSelector.addEventListener('change', updateEditor);
        saveButton.addEventListener('click', saveContent);
    }
    
    // --- INICIALIZAÇÃO ---
    loadContentFromStorage(); // Carrega o conteúdo salvo assim que a página é carregada
    document.getElementById('home-content').style.display = 'block'; // Mostra a página inicial
    setTimeout(() => contentArea.style.opacity = 1, 100);
});document.addEventListener('DOMContentLoaded', () => {
    // --- SELETORES DE ELEMENTOS ---
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const contentArea = document.getElementById('content-area');
    const topicSelector = document.getElementById('topic-selector');
    const contentEditor = document.getElementById('content-editor');
    const saveTextButton = document.getElementById('save-text-button');
    const imageUploader = document.getElementById('image-uploader');
    const addImageButton = document.getElementById('add-image-button');
    const statusMessage = document.getElementById('status-message');

    // Tópicos que podem ser gerenciados
    const manageableTopics = ['home', 'animais', 'corais', 'esponjas'];

    // Objeto para guardar os dados padrão (caso não haja nada no localStorage)
    const defaultData = {
        home: { text: "Este site é dedicado à incrível diversidade de vida encontrada em nossos oceanos...", images: ["https://images.unsplash.com/photo-1551989448-f35c4e2a7a4b?w=500&h=350&fit=crop"] },
        animais: { text: "Os oceanos do mundo abrigam uma vasta gama de vida animal...", images: ["https://images.unsplash.com/photo-1570481662446-524a8f93d324?w=500&h=350&fit=crop"] },
        corais: { text: "Frequentemente confundidos com rochas ou plantas, os corais são, na verdade, animais...", images: ["https://images.unsplash.com/photo-1552085489-4286903820a6?w=500&h=350&fit=crop"] },
        esponjas: { text: "As esponjas marinhas, do filo Porifera, estão entre os animais mais antigos...", images: ["https://images.unsplash.com/photo-1593178358248-1329b103135d?w=500&h=350&fit=crop"] }
    };

    // --- FUNÇÕES PRINCIPAIS ---

    // Exibe uma mensagem de status e a limpa depois
    function showStatus(message, duration = 3000) {
        statusMessage.innerText = message;
        setTimeout(() => { statusMessage.innerText = ''; }, duration);
    }

    // Pega os dados de um tópico (do localStorage ou padrão)
    function getTopicData(topicId) {
        const savedData = localStorage.getItem(topicId);
        return savedData ? JSON.parse(savedData) : defaultData[topicId];
    }

    // Salva os dados de um tópico no localStorage
    function saveTopicData(topicId, data) {
        localStorage.setItem(topicId, JSON.stringify(data));
    }

    // Renderiza o conteúdo (texto e imagens) de um tópico na página
    function renderTopic(topicId) {
        const data = getTopicData(topicId);
        if (!data) return;

        // Renderiza o texto
        document.getElementById(`p-${topicId}`).innerText = data.text;

        // Renderiza as imagens
        const gallery = document.getElementById(`gallery-${topicId}`);
        gallery.innerHTML = ''; // Limpa a galeria antes de adicionar novas imagens

        data.images.forEach(imgSrc => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = imgSrc;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerText = 'X';
            removeBtn.onclick = () => {
                // Remove a imagem da lista e salva
                const currentData = getTopicData(topicId);
                currentData.images = currentData.images.filter(src => src !== imgSrc);
                saveTopicData(topicId, currentData);
                renderTopic(topicId); // Re-renderiza o tópico para refletir a remoção
                showStatus('Imagem removida!');
            };

            galleryItem.appendChild(img);
            galleryItem.appendChild(removeBtn);
            gallery.appendChild(galleryItem);
        });
    }

    // Atualiza o painel de edição com os dados do tópico selecionado
    function updateEditorPanel() {
        const selectedTopicId = topicSelector.value;
        const data = getTopicData(selectedTopicId);
        contentEditor.value = data.text;
    }

    // --- LÓGICA DE NAVEGAÇÃO (igual a anterior) ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contentId = button.dataset.content;
            contentArea.style.opacity = 0;
            setTimeout(() => {
                contentSections.forEach(section => section.style.display = 'none');
                const activeSection = document.getElementById(`${contentId}-content`);
                if (activeSection) activeSection.style.display = 'block';
                contentArea.style.opacity = 1;
                if (contentId === 'gerenciar') updateEditorPanel();
            }, 300);
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // --- EVENT LISTENERS DO EDITOR ---

    // Trocar de tópico no seletor
    topicSelector.addEventListener('change', updateEditorPanel);

    // Salvar texto
    saveTextButton.addEventListener('click', () => {
        const topicId = topicSelector.value;
        const currentData = getTopicData(topicId);
        currentData.text = contentEditor.value;
        saveTopicData(topicId, currentData);
        renderTopic(topicId); // Re-renderiza para mostrar o texto atualizado
        showStatus('Texto salvo com sucesso!');
    });

    // Adicionar Imagem
    addImageButton.addEventListener('click', () => {
        const topicId = topicSelector.value;
        const file = imageUploader.files[0];
        if (!file) {
            showStatus('Por favor, selecione um arquivo de imagem primeiro.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgSrc = event.target.result;
            const currentData = getTopicData(topicId);
            currentData.images.push(imgSrc);
            saveTopicData(topicId, currentData);
            renderTopic(topicId); // Re-renderiza para mostrar a nova imagem
            showStatus('Imagem adicionada com sucesso!');
            imageUploader.value = ''; // Limpa o input
        };
        reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados (Base64)
    });

    // --- INICIALIZAÇÃO ---
    function initializeSite() {
        manageableTopics.forEach(topicId => renderTopic(topicId));
        document.getElementById('home-content').style.display = 'block';
        setTimeout(() => contentArea.style.opacity = 1, 100);
    }

    initializeSite();
});
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const mainNav = document.getElementById('main-nav');
    const contentWrapper = document.getElementById('content-wrapper');
    const manageContentSection = document.getElementById('gerenciar-content');
    
    // Controles de Gerenciamento
    const newTopicNameInput = document.getElementById('new-topic-name');
    const createTopicButton = document.getElementById('create-topic-button');
    const existingTopicsList = document.getElementById('existing-topics-list');
    const topicSelector = document.getElementById('topic-selector');
    const contentEditor = document.getElementById('content-editor');
    const saveTextButton = document.getElementById('save-text-button');
    const imageUploader = document.getElementById('image-uploader');
    const addImageButton = document.getElementById('add-image-button');
    const statusMessage = document.getElementById('status-message');
    const renameModal = document.getElementById('rename-modal');
    const renameInput = document.getElementById('rename-topic-input');
    const cancelRenameBtn = document.getElementById('cancel-rename-button');
    const confirmRenameBtn = document.getElementById('confirm-rename-button');

    let currentTopicToRename = null;

    // --- FUNÇÕES DE DADOS (localStorage) ---

    // Obtém a lista de IDs de tópicos
    function getTopicList() {
        const list = localStorage.getItem('topicList');
        // Se não existir, cria uma lista padrão
        return list ? JSON.parse(list) : ['home', 'animais', 'corais'];
    }

    // Salva a lista de IDs de tópicos
    function saveTopicList(list) {
        localStorage.setItem('topicList', JSON.stringify(list));
    }

    // Obtém os dados de um tópico específico (texto e imagens)
    function getTopicData(topicId) {
        const data = localStorage.getItem(topicId);
        // Se não existir, cria dados padrão
        return data ? JSON.parse(data) : { text: `Bem-vindo ao tópico sobre ${topicId}. Edite este texto.`, images: [] };
    }

    // Salva os dados de um tópico
    function saveTopicData(topicId, data) {
        localStorage.setItem(topicId, JSON.stringify(data));
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO E LÓGICA DA UI ---

    // Limpa a tela e recria toda a interface a partir dos dados salvos
    function renderSite() {
        const topicList = getTopicList();
        
        // Limpa a navegação e o conteúdo (exceto o painel de gerenciamento)
        mainNav.innerHTML = '';
        const sections = contentWrapper.querySelectorAll('.dynamic-section');
        sections.forEach(s => s.remove());

        // Recria a navegação e as seções para cada tópico
        topicList.forEach(topicId => {
            const topicData = getTopicData(topicId);
            const topicName = topicData.name || topicId.charAt(0).toUpperCase() + topicId.slice(1);
            
            // Cria o botão de navegação
            const navButton = document.createElement('button');
            navButton.className = 'nav-button';
            navButton.dataset.content = topicId;
            navButton.textContent = topicName;
            mainNav.appendChild(navButton);

            // Cria a seção de conteúdo (se não for 'home' que já existe)
            if (topicId !== 'home') {
                const section = document.createElement('section');
                section.className = 'content-section dynamic-section';
                section.id = `${topicId}-content`;
                section.style.display = 'none';
                section.innerHTML = `
                    <h2>${topicName}</h2>
                    <p id="p-${topicId}">${topicData.text}</p>
                    <div class="image-gallery" id="gallery-${topicId}"></div>
                `;
                // Insere a nova seção antes do painel de gerenciamento
                contentWrapper.insertBefore(section, manageContentSection);
            } else {
                 // Atualiza o conteúdo da seção 'home' que é fixa
                 document.getElementById('p-home').innerText = topicData.text;
                 document.querySelector('#home-content h2').innerText = topicName;
            }
            
            renderTopicImages(topicId, topicData.images);
        });

        // Adiciona o botão de "Gerenciar"
        const manageButton = document.createElement('button');
        manageButton.className = 'nav-button';
        manageButton.dataset.content = 'gerenciar';
        manageButton.textContent = 'Gerenciar';
        mainNav.appendChild(manageButton);

        // Re-vincula todos os eventos de navegação
        bindNavEvents();
        
        // Atualiza os painéis de gerenciamento
        populateManagementPanels();

        // Garante que o primeiro botão seja o ativo por padrão
        mainNav.querySelector('.nav-button').classList.add('active');
    }

    // Renderiza apenas as imagens de um tópico
    function renderTopicImages(topicId, images) {
        const gallery = document.getElementById(`gallery-${topicId}`);
        gallery.innerHTML = '';
        images.forEach((imgSrc, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${imgSrc}" alt="Imagem do tópico ${topicId}">
                <button class="remove-btn" data-index="${index}">X</button>
            `;
            gallery.appendChild(galleryItem);
        });

        // Adiciona evento para os novos botões de remoção
        gallery.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const data = getTopicData(topicId);
                data.images.splice(btn.dataset.index, 1); // Remove pelo índice
                saveTopicData(topicId, data);
                renderTopicImages(topicId, data.images); // Re-renderiza só as imagens
                showStatus('Imagem removida!');
            });
        });
    }

    // Vincula os eventos de clique aos botões de navegação
    function bindNavEvents() {
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Lógica de troca de abas (igual à anterior)
                document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
                document.getElementById(`${button.dataset.content}-content`).style.display = 'block';
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    // Preenche os seletores e listas no painel de gerenciamento
    function populateManagementPanels() {
        const topicList = getTopicList();
        
        // Limpa conteúdos antigos
        topicSelector.innerHTML = '';
        existingTopicsList.innerHTML = '';

        topicList.forEach(topicId => {
            const topicData = getTopicData(topicId);
            const topicName = topicData.name || topicId.charAt(0).toUpperCase() + topicId.slice(1);
            
            // Popula o seletor de edição de conteúdo
            const option = document.createElement('option');
            option.value = topicId;
            option.textContent = topicName;
            topicSelector.appendChild(option);

            // Popula a lista de gerenciamento de tópicos
            const item = document.createElement('div');
            item.className = 'topic-item';
            item.innerHTML = `
                <span>${topicName}</span>
                <div class="topic-item-actions">
                    <button class="edit-btn" data-id="${topicId}">Renomear</button>
                    ${topicId !== 'home' ? `<button class="delete-btn" data-id="${topicId}">Deletar</button>` : ''}
                </div>
            `;
            existingTopicsList.appendChild(item);
        });

        // Adiciona eventos aos novos botões de editar/deletar
        existingTopicsList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openRenameModal(btn.dataset.id));
        });
        existingTopicsList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteTopic(btn.dataset.id));
        });

        updateEditorPanel();
    }
    
    // Atualiza o editor de texto quando o seletor muda
    function updateEditorPanel() {
        const selectedTopicId = topicSelector.value;
        if (selectedTopicId) {
            const data = getTopicData(selectedTopicId);
            contentEditor.value = data.text;
        }
    }

    // Mostra mensagem de status
    function showStatus(message) {
        statusMessage.innerText = message;
        setTimeout(() => { statusMessage.innerText = ''; }, 3000);
    }


    // --- FUNÇÕES DE AÇÃO (CRUD para Tópicos) ---

    function createTopic() {
        const newName = newTopicNameInput.value.trim();
        const newId = newName.toLowerCase().replace(/\s+/g, '-'); // Cria um ID amigável

        if (!newName) {
            alert('O nome do tópico não pode estar vazio.');
            return;
        }
        const topicList = getTopicList();
        if (topicList.includes(newId)) {
            alert('Um tópico com este nome já existe.');
            return;
        }

        topicList.push(newId);
        saveTopicList(topicList);

        // Salva dados iniciais para o novo tópico, incluindo seu nome de exibição
        const initialData = { name: newName, text: `Conteúdo sobre ${newName}.`, images: [] };
        saveTopicData(newId, initialData);

        newTopicNameInput.value = '';
        renderSite(); // Reconstrói toda a UI
        showStatus('Tópico criado com sucesso!');
    }

    function deleteTopic(topicId) {
        if (!confirm(`Tem certeza que deseja deletar o tópico "${topicId}"? Esta ação não pode ser desfeita.`)) {
            return;
        }
        
        let topicList = getTopicList();
        topicList = topicList.filter(id => id !== topicId);
        saveTopicList(topicList);

        localStorage.removeItem(topicId); // Remove os dados do tópico
        renderSite(); // Reconstrói a UI
        showStatus('Tópico deletado com sucesso!');
    }

    function openRenameModal(topicId) {
        currentTopicToRename = topicId;
        const topicData = getTopicData(topicId);
        renameInput.value = topicData.name || topicId;
        renameModal.showModal();
    }
    
    function confirmRename() {
        const newName = renameInput.value.trim();
        const oldId = currentTopicToRename;
        
        if (!newName || !oldId) return;

        const topicData = getTopicData(oldId);
        topicData.name = newName; // Atualiza o nome de exibição
        
        // Como o ID não muda, apenas salvamos os dados atualizados
        saveTopicData(oldId, topicData);

        renameModal.close();
        renderSite();
        showStatus('Tópico renomeado com sucesso!');
    }


    // --- EVENT LISTENERS ---
    createTopicButton.addEventListener('click', createTopic);
    topicSelector.addEventListener('change', updateEditorPanel);
    saveTextButton.addEventListener('click', () => {
        const topicId = topicSelector.value;
        const data = getTopicData(topicId);
        data.text = contentEditor.value;
        saveTopicData(topicId, data);
        document.getElementById(`p-${topicId}`).innerText = data.text;
        showStatus('Texto salvo!');
    });
    addImageButton.addEventListener('click', () => {
        const topicId = topicSelector.value;
        const file = imageUploader.files[0];
        if (!file || !topicId) {
            showStatus('Selecione um tópico e um arquivo.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = getTopicData(topicId);
            data.images.push(event.target.result);
            saveTopicData(topicId, data);
            renderTopicImages(topicId, data.images);
            showStatus('Imagem adicionada!');
        };
        reader.readAsDataURL(file);
    });
    
    // Listeners do Modal
    cancelRenameBtn.addEventListener('click', () => renameModal.close());
    confirmRenameBtn.addEventListener('click', confirmRename);


    // --- INICIALIZAÇÃO ---
    renderSite();
    document.getElementById('home-content').style.display = 'block'; // Mostra o início por padrão
});
document.addEventListener('DOMContentLoaded', () => {
    // --- SELETORES GLOBAIS ---
    const dom = {
        mainNav: document.getElementById('main-nav'),
        contentWrapper: document.getElementById('content-wrapper'),
        manageContentSection: document.getElementById('gerenciar-content'),
        siteMainTitle: document.getElementById('site-main-title'),
        siteTitleInput: document.getElementById('site-title-input'),
        saveSiteTitleBtn: document.getElementById('save-site-title-btn'),
        backgroundUrlInput: document.getElementById('background-url-input'),
        saveBackgroundBtn: document.getElementById('save-background-btn'),
        resetBackgroundBtn: document.getElementById('reset-background-btn'),
        backgroundContainer: document.querySelector('.background-container'),
        newTopicNameInput: document.getElementById('new-topic-name'),
        createTopicButton: document.getElementById('create-topic-button'),
        existingTopicsList: document.getElementById('existing-topics-list'),
        topicSelector: document.getElementById('topic-selector'),
        contentEditor: document.getElementById('content-editor'),
        saveTextButton: document.getElementById('save-text-button'),
        imageUploader: document.getElementById('image-uploader'),
        imageCaptionInput: document.getElementById('image-caption-input'),
        imageAlignSelect: document.getElementById('image-align-select'),
        addImageButton: document.getElementById('add-image-button'),
        statusMessage: document.getElementById('status-message'),
        renameModal: document.getElementById('rename-modal'),
        renameInput: document.getElementById('rename-topic-input'),
        cancelRenameBtn: document.getElementById('cancel-rename-button'),
        confirmRenameBtn: document.getElementById('confirm-rename-button')
    };
    const defaultBackground = 'url("https://images.unsplash.com/photo-1439405326853-58f2724f795b?w=1200&h=800&fit=crop")';
    let currentTopicToRename = null;

    // --- DADOS (localStorage) ---

    // PONTO DA CORREÇÃO 1: A lista padrão agora inclui os tópicos de exemplo.
    const getTopicList = () => JSON.parse(localStorage.getItem('topicList')) || ['home', 'animais', 'corais'];
    
    // PONTO DA CORREÇÃO 2: Fornece dados padrão para os tópicos de exemplo se eles não existirem.
    const getTopicData = (topicId) => {
        const data = localStorage.getItem(topicId);
        if (data) { // Se já existem dados salvos, usa eles
            let parsedData = JSON.parse(data);
             // Migração de dados antigos para o novo formato de imagem
            if (parsedData.images && parsedData.images.length > 0 && typeof parsedData.images[0] === 'string') {
                parsedData.images = parsedData.images.map(src => ({ src, caption: '', align: 'center' }));
            }
            return parsedData;
        }
        // Se não existem dados salvos, cria os dados padrão
        switch(topicId) {
            case 'home':
                return { name: 'Início', text: `Bem-vindo! Este site é totalmente customizável. Use o botão "Gerenciar" para editar o conteúdo.`, images: [] };
            case 'animais':
                return { name: 'Animais', text: `Os oceanos abrigam uma incrível diversidade de animais, desde os gigantes gentis como as baleias até os mestres da camuflagem como os polvos.`, images: [] };
            case 'corais':
                return { name: 'Corais', text: `Recifes de coral são ecossistemas vibrantes, formados por colônias de pequenos animais. Eles são vitais para a saúde dos oceanos.`, images: [] };
            default:
                return { name: 'Novo Tópico', text: `Conteúdo deste novo tópico.`, images: [] };
        }
    };
    
    const saveTopicList = (list) => localStorage.setItem('topicList', JSON.stringify(list));
    const saveTopicData = (topicId, data) => localStorage.setItem(topicId, JSON.stringify(data));
    const getSiteSettings = () => JSON.parse(localStorage.getItem('siteSettings')) || { title: 'Wiki da Biodiversidade Marinha', background: defaultBackground };
    const saveSiteSettings = (settings) => localStorage.setItem('siteSettings', JSON.stringify(settings));

    // --- RENDERIZAÇÃO ---
    const applySiteSettings = () => { /* ... (sem alterações) ... */ };
    
    const renderSite = () => {
        const topicList = getTopicList();
        dom.mainNav.innerHTML = '';
        dom.contentWrapper.querySelectorAll('.dynamic-section').forEach(s => s.remove());

        // Cria as seções de conteúdo primeiro
        topicList.forEach(topicId => {
            if (!document.getElementById(`${topicId}-content`)) {
                const section = document.createElement('section');
                section.className = 'content-section dynamic-section';
                section.id = `${topicId}-content`;
                section.style.display = 'none';
                section.innerHTML = `<h2></h2><p id="p-${topicId}"></p><div class="image-gallery" id="gallery-${topicId}"></div>`;
                dom.contentWrapper.insertBefore(section, dom.manageContentSection);
            }
        });

        // Agora popula as seções e a navegação
        topicList.forEach(topicId => {
            const topicData = getTopicData(topicId);
            const navButton = document.createElement('button');
            navButton.className = 'nav-button';
            navButton.dataset.content = topicId;
            navButton.textContent = topicData.name;
            dom.mainNav.appendChild(navButton);
            
            document.getElementById(`p-${topicId}`).innerText = topicData.text;
            document.querySelector(`#${topicId}-content h2`).innerText = topicData.name;
            renderTopicImages(topicId, topicData.images);
        });

        const manageButton = document.createElement('button');
        manageButton.className = 'nav-button';
        manageButton.dataset.content = 'gerenciar';
        manageButton.textContent = 'Gerenciar';
        dom.mainNav.appendChild(manageButton);

        bindNavEvents();
        populateManagementPanels();
        showSection(getTopicList()[0] || 'home'); // Mostra a primeira seção da lista
    };
    
    // ... (O resto do script é o mesmo da versão anterior e estável)
    const renderTopicImages = (topicId, images) => { /* ... */ };
    const bindNavEvents = () => { /* ... */ };
    const showSection = (sectionId) => { /* ... */ };
    const populateManagementPanels = () => { /* ... */ };
    const updateEditorPanel = () => { /* ... */ };
    const showStatus = (message) => { /* ... */ };
    const createTopic = () => { /* ... */ };
    const deleteTopic = (topicId) => { /* ... */ };
    const openRenameModal = (topicId) => { /* ... */ };
    const confirmRename = () => { /* ... */ };
    
    // --- EVENT LISTENERS ---
    dom.saveSiteTitleBtn.addEventListener('click', () => { /* ... */ });
    dom.saveBackgroundBtn.addEventListener('click', () => { /* ... */ });
    dom.resetBackgroundBtn.addEventListener('click', () => { /* ... */ });
    dom.createTopicButton.addEventListener('click', createTopic);
    dom.topicSelector.addEventListener('change', updateEditorPanel);
    dom.saveTextButton.addEventListener('click', () => { /* ... */ });
    dom.addImageButton.addEventListener('click', () => { /* ... */ });
    dom.cancelRenameBtn.addEventListener('click', () => dom.renameModal.close());
    dom.confirmRenameBtn.addEventListener('click', confirmRename);
    
    // --- INICIALIZAÇÃO ---
    const initializeSite = () => { applySiteSettings(); renderSite(); };
    initializeSite();
    
    // Para colar o resto das funções que não mudaram:
    applySiteSettings();
    renderTopicImages = (topicId, images) => {
        const gallery = document.getElementById(`gallery-${topicId}`);
        if (!gallery) return;
        gallery.innerHTML = '';
        images.forEach((imgData, index) => {
            const figure = document.createElement('figure');
            figure.className = `img-align-${imgData.align}`;
            figure.innerHTML = `<img src="${imgData.src}" alt="${imgData.caption || ''}"><button class="remove-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>${imgData.caption ? `<figcaption>${imgData.caption}</figcaption>` : ''}`;
            gallery.appendChild(figure);
        });
        gallery.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', () => { const data = getTopicData(topicId); data.images.splice(btn.dataset.index, 1); saveTopicData(topicId, data); renderTopicImages(topicId, data.images); showStatus('Imagem removida!'); }));
    };
    bindNavEvents = () => { document.querySelectorAll('.nav-button').forEach(button => { button.addEventListener('click', () => showSection(button.dataset.content)); }); };
    showSection = (sectionId) => { if(!sectionId) return; document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none'); document.getElementById(`${sectionId}-content`).style.display = 'block'; document.querySelectorAll('.nav-button').forEach(btn => btn.classList.toggle('active', btn.dataset.content === sectionId)); };
    populateManagementPanels = () => { const topicList = getTopicList(); dom.topicSelector.innerHTML = ''; dom.existingTopicsList.innerHTML = ''; topicList.forEach(topicId => { const topicName = getTopicData(topicId).name; dom.topicSelector.add(new Option(topicName, topicId)); const item = document.createElement('div'); item.className = 'topic-item'; item.innerHTML = `<span>${topicName}</span><div class="topic-item-actions"><button class="edit-btn" data-id="${topicId}">Renomear</button>${topicId !== 'home' ? `<button class="delete-btn" data-id="${topicId}">Deletar</button>` : ''}</div>`; dom.existingTopicsList.appendChild(item); }); dom.existingTopicsList.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => openRenameModal(btn.dataset.id))); dom.existingTopicsList.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => deleteTopic(btn.dataset.id))); updateEditorPanel(); };
    updateEditorPanel = () => { dom.contentEditor.value = getTopicData(dom.topicSelector.value)?.text || ''; };
    showStatus = (message) => { dom.statusMessage.innerText = message; setTimeout(() => { dom.statusMessage.innerText = ''; }, 3000); };
    createTopic = () => { const newName = dom.newTopicNameInput.value.trim(); if (!newName) return alert('O nome do tópico não pode estar vazio.'); const newId = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); const topicList = getTopicList(); if (topicList.includes(newId)) return alert('Um tópico com ID similar já existe.'); topicList.push(newId); saveTopicList(topicList); saveTopicData(newId, { name: newName, text: `Conteúdo sobre ${newName}.`, images: [] }); dom.newTopicNameInput.value = ''; renderSite(); showStatus('Tópico criado!'); };
    deleteTopic = (topicId) => { if (!confirm(`Tem certeza que deseja deletar este tópico?`)) return; saveTopicList(getTopicList().filter(id => id !== topicId)); localStorage.removeItem(topicId); renderSite(); showStatus('Tópico deletado!'); showSection('home'); };
    openRenameModal = (topicId) => { currentTopicToRename = topicId; dom.renameInput.value = getTopicData(topicId).name; dom.renameModal.showModal(); };
    confirmRename = () => { const newName = dom.renameInput.value.trim(); if (!newName || !currentTopicToRename) return; const data = getTopicData(currentTopicToRename); data.name = newName; saveTopicData(currentTopicToRename, data); dom.renameModal.close(); renderSite(); showStatus('Tópico renomeado!'); };
    dom.saveSiteTitleBtn.addEventListener('click', () => { const s = getSiteSettings(); s.title = dom.siteTitleInput.value || 'Wiki Marinha'; saveSiteSettings(s); applySiteSettings(); showStatus('Título atualizado!'); });
    dom.saveBackgroundBtn.addEventListener('click', () => { const s = getSiteSettings(); const url = dom.backgroundUrlInput.value.trim(); if (url) { s.background = `url("${url}")`; saveSiteSettings(s); applySiteSettings(); showStatus('Fundo atualizado!'); } });
    dom.resetBackgroundBtn.addEventListener('click', () => { const s = getSiteSettings(); s.background = defaultBackground; saveSiteSettings(s); applySiteSettings(); showStatus('Fundo restaurado!'); });
    dom.createTopicButton.addEventListener('click', createTopic);
    dom.topicSelector.addEventListener('change', updateEditorPanel);
    dom.saveTextButton.addEventListener('click', () => { const id = dom.topicSelector.value; const data = getTopicData(id); data.text = dom.contentEditor.value; saveTopicData(id, data); document.getElementById(`p-${id}`).innerText = data.text; showStatus('Texto salvo!'); });
    dom.addImageButton.addEventListener('click', () => { const id = dom.topicSelector.value; const file = dom.imageUploader.files[0]; if (!file || !id) return showStatus('Selecione um tópico e um arquivo.'); const reader = new FileReader(); reader.onload = (e) => { const data = getTopicData(id); data.images.push({ src: e.target.result, caption: dom.imageCaptionInput.value.trim(), align: dom.imageAlignSelect.value }); saveTopicData(id, data); renderTopicImages(id, data.images); showStatus('Imagem adicionada!'); dom.imageUploader.value = ''; dom.imageCaptionInput.value = ''; }; reader.readAsDataURL(file); });
    dom.cancelRenameBtn.addEventListener('click', () => dom.renameModal.close());
    dom.confirmRenameBtn.addEventListener('click', confirmRename);
});
document.addEventListener('DOMContentLoaded', () => {

    // 1. SELETORES DE ELEMENTOS DO DOM
    // Objeto para centralizar todos os elementos que vamos manipular
    const dom = {
        mainNav: document.getElementById('main-nav'),
        contentWrapper: document.getElementById('content-wrapper'),
        manageContentSection: document.getElementById('gerenciar-content'),
        siteMainTitle: document.getElementById('site-main-title'),
        siteTitleInput: document.getElementById('site-title-input'),
        saveSiteTitleBtn: document.getElementById('save-site-title-btn'),
        backgroundUrlInput: document.getElementById('background-url-input'),
        saveBackgroundBtn: document.getElementById('save-background-btn'),
        resetBackgroundBtn: document.getElementById('reset-background-btn'),
        backgroundContainer: document.querySelector('.background-container'),
        newTopicNameInput: document.getElementById('new-topic-name'),
        createTopicButton: document.getElementById('create-topic-button'),
        existingTopicsList: document.getElementById('existing-topics-list'),
        topicSelector: document.getElementById('topic-selector'),
        contentEditor: document.getElementById('content-editor'),
        saveTextButton: document.getElementById('save-text-button'),
        imageUploader: document.getElementById('image-uploader'),
        imageCaptionInput: document.getElementById('image-caption-input'),
        imageAlignSelect: document.getElementById('image-align-select'),
        addImageButton: document.getElementById('add-image-button'),
        statusMessage: document.getElementById('status-message'),
        renameModal: document.getElementById('rename-modal'),
        renameInput: document.getElementById('rename-topic-input'),
        cancelRenameBtn: document.getElementById('cancel-rename-button'),
        confirmRenameBtn: document.getElementById('confirm-rename-button')
    };
    const defaultBackground = 'url("https://images.unsplash.com/photo-1439405326853-58f2724f795b?w=1200&h=800&fit=crop")';
    let currentTopicToRename = null;

    // 2. FUNÇÕES DE DADOS (GERENCIAMENTO DO localStorage)
    const getSiteSettings = () => JSON.parse(localStorage.getItem('siteSettings')) || { title: 'Wiki da Biodiversidade Marinha', background: defaultBackground };
    const saveSiteSettings = (settings) => localStorage.setItem('siteSettings', JSON.stringify(settings));
    const getTopicList = () => JSON.parse(localStorage.getItem('topicList')) || ['home', 'animais', 'corais'];
    const saveTopicList = (list) => localStorage.setItem('topicList', JSON.stringify(list));
    const getTopicData = (topicId) => {
        const data = localStorage.getItem(topicId);
        if (data) {
            let parsedData = JSON.parse(data);
            if (parsedData.images && parsedData.images.length > 0 && typeof parsedData.images[0] === 'string') {
                parsedData.images = parsedData.images.map(src => ({ src, caption: '', align: 'center' }));
                saveTopicData(topicId, parsedData); // Salva os dados convertidos
            }
            return parsedData;
        }
        switch(topicId) {
            case 'home': return { name: 'Início', text: `Bem-vindo! Este site é totalmente customizável. Use o botão "Gerenciar" para editar o conteúdo.`, images: [] };
            case 'animais': return { name: 'Animais', text: `Os oceanos abrigam uma incrível diversidade de animais, desde os gigantes gentis como as baleias até os mestres da camuflagem como os polvos.`, images: [] };
            case 'corais': return { name: 'Corais', text: `Recifes de coral são ecossistemas vibrantes, formados por colônias de pequenos animais. Eles são vitais para a saúde dos oceanos.`, images: [] };
            default: return { name: 'Novo Tópico', text: `Conteúdo deste novo tópico.`, images: [] };
        }
    };
    const saveTopicData = (topicId, data) => localStorage.setItem(topicId, JSON.stringify(data));

    // 3. FUNÇÕES DE RENDERIZAÇÃO (constrói a interface)
    const applySiteSettings = () => {
        const settings = getSiteSettings();
        document.title = settings.title;
        dom.siteMainTitle.innerText = settings.title;
        dom.backgroundContainer.style.backgroundImage = settings.background;
        dom.siteTitleInput.value = settings.title;
        dom.backgroundUrlInput.value = (settings.background === defaultBackground) ? '' : settings.background.slice(5, -2);
    };

    const renderSite = () => {
        const topicList = getTopicList();
        dom.mainNav.innerHTML = '';
        dom.contentWrapper.querySelectorAll('.dynamic-section').forEach(s => s.remove());

        // Cria as seções de conteúdo primeiro
        topicList.forEach(topicId => {
            if (!document.getElementById(`${topicId}-content`)) {
                const section = document.createElement('section');
                section.className = `content-section dynamic-section`;
                section.id = `${topicId}-content`;
                section.style.display = 'none';
                section.innerHTML = `<h2></h2><p id="p-${topicId}"></p><div class="image-gallery" id="gallery-${topicId}"></div>`;
                dom.contentWrapper.insertBefore(section, dom.manageContentSection);
            }
        });
        
        // Popula as seções e a navegação
        topicList.forEach(topicId => {
            const topicData = getTopicData(topicId);
            const navButton = document.createElement('button');
            navButton.className = 'nav-button';
            navButton.dataset.content = topicId;
            navButton.textContent = topicData.name;
            dom.mainNav.appendChild(navButton);
            
            const titleElement = document.querySelector(`#${topicId}-content h2`);
            const paragraphElement = document.getElementById(`p-${topicId}`);
            if (titleElement) titleElement.innerText = topicData.name;
            if (paragraphElement) paragraphElement.innerText = topicData.text;
            renderTopicImages(topicId, topicData.images);
        });

        const manageButton = document.createElement('button');
        manageButton.className = 'nav-button';
        manageButton.dataset.content = 'gerenciar';
        manageButton.textContent = 'Gerenciar';
        dom.mainNav.appendChild(manageButton);

        bindNavEvents();
        populateManagementPanels();
    };

    const renderTopicImages = (topicId, images) => {
        const gallery = document.getElementById(`gallery-${topicId}`);
        if (!gallery) return;
        gallery.innerHTML = '';
        images.forEach((imgData, index) => {
            const figure = document.createElement('figure');
            figure.className = `img-align-${imgData.align}`;
            figure.innerHTML = `
                <img src="${imgData.src}" alt="${imgData.caption || ''}">
                ${imgData.caption ? `<figcaption>${imgData.caption}</figcaption>` : ''}
                <button class="remove-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>`;
            gallery.appendChild(figure);
        });
        gallery.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', () => {
            const data = getTopicData(topicId);
            data.images.splice(btn.dataset.index, 1);
            saveTopicData(topicId, data);
            renderTopicImages(topicId, data.images);
            showStatus('Imagem removida!');
        }));
    };

    // 4. FUNÇÕES DE LÓGICA E AÇÕES DO USUÁRIO
    const bindNavEvents = () => {
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', () => showSection(button.dataset.content));
        });
    };

    const showSection = (sectionId) => {
        if (!sectionId || !document.getElementById(`${sectionId}-content`)) return;
        document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
        document.getElementById(`${sectionId}-content`).style.display = 'block';
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.content === sectionId);
        });
    };

    const populateManagementPanels = () => {
        const topicList = getTopicList();
        dom.topicSelector.innerHTML = '';
        dom.existingTopicsList.innerHTML = '';
        topicList.forEach(topicId => {
            const topicName = getTopicData(topicId).name;
            dom.topicSelector.add(new Option(topicName, topicId));
            const item = document.createElement('div');
            item.className = 'topic-item';
            item.innerHTML = `
                <span>${topicName}</span>
                <div class="topic-item-actions">
                    <button class="edit-btn" data-id="${topicId}">Renomear</button>
                    ${topicId !== 'home' ? `<button class="delete-btn" data-id="${topicId}">Deletar</button>` : ''}
                </div>`;
            dom.existingTopicsList.appendChild(item);
        });
        dom.existingTopicsList.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => openRenameModal(btn.dataset.id)));
        dom.existingTopicsList.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => deleteTopic(btn.dataset.id)));
        updateEditorPanel();
    };

    const updateEditorPanel = () => { dom.contentEditor.value = getTopicData(dom.topicSelector.value)?.text || ''; };
    const showStatus = (message) => { dom.statusMessage.innerText = message; setTimeout(() => { dom.statusMessage.innerText = ''; }, 3000); };
    
    const createTopic = () => {
        const newName = dom.newTopicNameInput.value.trim();
        if (!newName) return alert('O nome do tópico não pode estar vazio.');
        const newId = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const topicList = getTopicList();
        if (topicList.includes(newId)) return alert('Um tópico com ID similar já existe.');
        topicList.push(newId);
        saveTopicList(topicList);
        saveTopicData(newId, { name: newName, text: `Conteúdo sobre ${newName}.`, images: [] });
        dom.newTopicNameInput.value = '';
        renderSite();
        showStatus('Tópico criado!');
    };

    const deleteTopic = (topicId) => {
        if (!confirm(`Tem certeza que deseja deletar este tópico?`)) return;
        saveTopicList(getTopicList().filter(id => id !== topicId));
        localStorage.removeItem(topicId);
        renderSite();
        showStatus('Tópico deletado!');
        showSection('home');
    };

    const openRenameModal = (topicId) => { currentTopicToRename = topicId; dom.renameInput.value = getTopicData(topicId).name; dom.renameModal.showModal(); };
    const confirmRename = () => {
        const newName = dom.renameInput.value.trim();
        if (!newName || !currentTopicToRename) return;
        const data = getTopicData(currentTopicToRename);
        data.name = newName;
        saveTopicData(currentTopicToRename, data);
        dom.renameModal.close();
        renderSite();
        showStatus('Tópico renomeado!');
    };
    
    // 5. EVENT LISTENERS (Conectando tudo)
    dom.saveSiteTitleBtn.addEventListener('click', () => {
        const s = getSiteSettings();
        s.title = dom.siteTitleInput.value || 'Wiki Marinha';
        saveSiteSettings(s);
        applySiteSettings();
        showStatus('Título atualizado!');
    });
    dom.saveBackgroundBtn.addEventListener('click', () => {
        const s = getSiteSettings();
        const url = dom.backgroundUrlInput.value.trim();
        if (url) { s.background = `url("${url}")`; saveSiteSettings(s); applySiteSettings(); showStatus('Fundo atualizado!'); }
    });
    dom.resetBackgroundBtn.addEventListener('click', () => {
        const s = getSiteSettings();
        s.background = defaultBackground;
        saveSiteSettings(s);
        applySiteSettings();
        showStatus('Fundo restaurado!');
    });
    dom.createTopicButton.addEventListener('click', createTopic);
    dom.topicSelector.addEventListener('change', updateEditorPanel);
    dom.saveTextButton.addEventListener('click', () => {
        const id = dom.topicSelector.value;
        const data = getTopicData(id);
        data.text = dom.contentEditor.value;
        saveTopicData(id, data);
        document.getElementById(`p-${id}`).innerText = data.text;
        showStatus('Texto salvo!');
    });
    dom.addImageButton.addEventListener('click', () => {
        const id = dom.topicSelector.value;
        const file = dom.imageUploader.files[0];
        if (!file || !id) return showStatus('Selecione um tópico e um arquivo.');
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = getTopicData(id);
            data.images.push({ src: e.target.result, caption: dom.imageCaptionInput.value.trim(), align: dom.imageAlignSelect.value });
            saveTopicData(id, data);
            renderTopicImages(id, data.images);
            showStatus('Imagem adicionada!');
            dom.imageUploader.value = '';
            dom.imageCaptionInput.value = '';
        };
        reader.readAsDataURL(file);
    });
    dom.cancelRenameBtn.addEventListener('click', () => dom.renameModal.close());
    dom.confirmRenameBtn.addEventListener('click', confirmRename);

    // 6. INICIALIZAÇÃO (O ponto de partida que executa o código)
    const initializeSite = () => {
        applySiteSettings();
        renderSite();
        showSection('home'); // Garante que a seção inicial seja exibida
    };

    initializeSite();
});