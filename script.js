document.addEventListener('DOMContentLoaded', function() {
    // Elementos da timeline e navegação
    const timelineItems = document.querySelectorAll('.timeline-item');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Elementos de música
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.querySelector('.music-icon');
    
    // Estado atual
    let currentMoment = 1;
    let isMusicPlaying = false;
    
    // Inicializar a timeline e música
    initTimeline();
    
    function initTimeline() {
        showMoment(1);
        addEventListeners();
        addScrollAnimations();
        addHeartAnimations();
        initMusicControl();
    }
    
    // Inicializar controle de música
    function initMusicControl() {
        // Configurar volume inicial
        backgroundMusic.volume = 0.3;
        
        // Event listener para o botão de música
        musicToggle.addEventListener('click', toggleMusic);
        
        // Tentar reproduzir automaticamente (pode ser bloqueado pelo navegador)
        tryAutoPlay();
        
        // Event listeners para eventos de áudio
        backgroundMusic.addEventListener('play', function() {
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.classList.remove('paused');
            musicIcon.textContent = '🎵';
        });
        
        backgroundMusic.addEventListener('pause', function() {
            isMusicPlaying = false;
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('paused');
            musicIcon.textContent = '🔇';
        });
        
        // Adicionar efeito visual quando a música está tocando
        backgroundMusic.addEventListener('timeupdate', function() {
            if (isMusicPlaying) {
                // Efeito sutil de pulsação nos corações quando a música toca
                const hearts = document.querySelectorAll('.heart');
                hearts.forEach(heart => {
                    heart.style.filter = `hue-rotate(${Math.sin(backgroundMusic.currentTime) * 30}deg)`;
                });
            }
        });
    }
    
    // Tentar reprodução automática
    function tryAutoPlay() {
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Reprodução automática bem-sucedida
                console.log('🎵 Música iniciada automaticamente');
            }).catch(error => {
                // Reprodução automática foi bloqueada
                console.log('🔇 Reprodução automática bloqueada pelo navegador');
                musicToggle.classList.add('paused');
                musicIcon.textContent = '🔇';
            });
        }
    }
    
    // Alternar reprodução da música
    function toggleMusic() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
        } else {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Erro ao reproduzir música:', error);
                });
            }
        }
        
        // Efeito de clique no botão
        musicToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            musicToggle.style.transform = '';
        }, 150);
    }
    
    // Mostrar momento específico
    function showMoment(momentNumber) {
        // Remover classe active de todos os itens
        timelineItems.forEach(item => {
            item.classList.remove('active');
        });
        
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Adicionar classe active ao momento atual
        const targetItem = document.querySelector(`[data-moment="${momentNumber}"]`);
        const targetButton = document.querySelector(`[data-target="${momentNumber}"]`);
        
        if (targetItem && targetButton) {
            // Animação de saída
            setTimeout(() => {
                targetItem.classList.add('active');
                targetButton.classList.add('active');
                currentMoment = momentNumber;
                
                // Scroll suave para o elemento
                targetItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Adicionar efeito de brilho na imagem
                const image = targetItem.querySelector('.moment-image');
                if (image) {
                    image.style.filter = 'brightness(1.1) saturate(1.2)';
                    setTimeout(() => {
                        image.style.filter = 'brightness(1) saturate(1)';
                    }, 1000);
                }
                
            }, 100);
        }
    }
    
    // Adicionar event listeners
    function addEventListeners() {
        // Navegação por botões
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const target = parseInt(this.getAttribute('data-target'));
                showMoment(target);
                
                // Efeito de clique
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && currentMoment > 1) {
                showMoment(currentMoment - 1);
            } else if (e.key === 'ArrowRight' && currentMoment < timelineItems.length) {
                showMoment(currentMoment + 1);
            } else if (e.key === ' ' && e.target.tagName !== 'INPUT') { // Adicionado para controle de música
                toggleMusic();
                e.preventDefault(); // Previne o scroll da página ao pressionar espaço
            }
        });
        
        // Clique nas imagens para navegação
        timelineItems.forEach((item, index) => {
            const image = item.querySelector('.moment-image');
            if (image) {
                image.addEventListener('click', function() {
                    const nextMoment = index === 0 ? 2 : 1;
                    showMoment(nextMoment);
                });
                
                // Cursor pointer para indicar clicabilidade
                image.style.cursor = 'pointer';
            }
        });
    }
    
    // Animações de scroll
    function addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observar elementos para animação
        const elementsToAnimate = document.querySelectorAll('.moment-card, .header, .navigation, .footer, .calendars-section'); // Adicionado calendars-section
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease';
            observer.observe(el);
        });
    }
    
    // Animações dos corações
    function addHeartAnimations() {
        const hearts = document.querySelectorAll('.heart, .image-heart');
        
        hearts.forEach(heart => {
            heart.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.5) rotate(15deg)';
                this.style.filter = 'hue-rotate(45deg) brightness(1.2)';
            });
            
            heart.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.filter = '';
            });
        });
        
        // Animação automática dos corações do header
        const headerHearts = document.querySelectorAll('.header .heart');
        setInterval(() => {
            headerHearts.forEach((heart, index) => {
                setTimeout(() => {
                    heart.style.transform = 'scale(1.3) rotate(10deg)';
                    heart.style.filter = 'hue-rotate(30deg)';
                    
                    setTimeout(() => {
                        heart.style.transform = '';
                        heart.style.filter = '';
                    }, 300);
                }, index * 200);
            });
        }, 5000);
    }
    
    // Efeito de partículas de coração
    function createHeartParticle(x, y) {
        const particle = document.createElement('div');
        particle.innerHTML = '💕';
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.fontSize = '20px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.animation = 'floatUp 2s ease-out forwards';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
    
    // CSS para animação das partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(0.5);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar partículas ao clicar nas imagens
    timelineItems.forEach(item => {
        const image = item.querySelector('.moment-image');
        if (image) {
            image.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                // Criar múltiplas partículas
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        createHeartParticle(
                            x + (Math.random() - 0.5) * 100,
                            y + (Math.random() - 0.5) * 100
                        );
                    }, i * 100);
                }
            });
        }
    });
    
    // Auto-navegação (opcional)
    let autoPlay = false;
    let autoPlayInterval;
    
    function startAutoPlay() {
        if (autoPlay) return;
        
        autoPlay = true;
        autoPlayInterval = setInterval(() => {
            const nextMoment = currentMoment === timelineItems.length ? 1 : currentMoment + 1;
            showMoment(nextMoment);
        }, 8000);
    }
    
    function stopAutoPlay() {
        autoPlay = false;
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Parar auto-play quando usuário interage
    navButtons.forEach(btn => {
        btn.addEventListener('click', stopAutoPlay);
    });
    
    document.addEventListener('keydown', stopAutoPlay);
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        console.log('💕 Site do casal carregado com amor!');
        console.log('Use as setas do teclado ou os botões para navegar');
        console.log('Clique nas imagens para ver efeitos especiais!');
    }, 1000);
});

// Função para abrir calendários (global para ser acessível do HTML)
function openCalendar(type) {
    if (type === 'hero') {
        window.location.href = 'hero-calendar.html';
    } else if (type === 'romance') {
        window.location.href = 'romance-calendar.html';
    }
}


