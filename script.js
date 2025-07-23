document.addEventListener('DOMContentLoaded', function() {
    // Elementos da timeline e navegação
    const timelineItems = document.querySelectorAll('.timeline-item');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Elementos de música
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.querySelector('.music-icon');
    
    // Elementos do calendário
    const calendarModal = document.getElementById('calendar-modal');
    const calendarContainer = document.querySelector('.calendar-container');
    const calendarTitle = document.getElementById('calendar-title');
    const closeCalendar = document.getElementById('close-calendar');
    const currentMonthEl = document.getElementById('current-month');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const eventTitle = document.getElementById('event-title');
    const eventDate = document.getElementById('event-date');
    const addEventBtn = document.getElementById('add-event');
    const eventsList = document.getElementById('events-list');
    
    // Estado atual
    let currentMoment = 1;
    let isMusicPlaying = false;
    let currentCalendarType = null;
    let currentDate = new Date();
    let selectedDate = null;
    let currentTheme = 1;
    
    // Dados dos calendários (separados por usuário)
    let calendarData = {
        hero: {
            events: JSON.parse(localStorage.getItem('hero-calendar-events') || '[]'),
            theme: parseInt(localStorage.getItem('hero-calendar-theme') || '1')
        },
        romance: {
            events: JSON.parse(localStorage.getItem('romance-calendar-events') || '[]'),
            theme: parseInt(localStorage.getItem('romance-calendar-theme') || '1')
        }
    };
    
    // Configurações dos temas
    const themes = {
        hero: {
            1: { name: 'Batman', colors: ['#1a1a1a', '#333'], icon: '🦇' },
            2: { name: 'Homem-Aranha', colors: ['#ff0000', '#cc0000'], icon: '🕷️' },
            3: { name: 'Superman', colors: ['#0066cc', '#004499'], icon: '🦸‍♂️' }
        },
        romance: {
            1: { name: 'Bridgerton', colors: ['#ff69b4', '#ff1493'], icon: '👑' },
            2: { name: 'Heartstopper', colors: ['#ff6b6b', '#ee5a52'], icon: '💖' },
            3: { name: 'Virgin River', colors: ['#ffc0cb', '#ffb6c1'], icon: '🌸' }
        }
    };
    
    // Meses em português
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    // Inicializar
    initTimeline();
    initCalendar();
    
    function initTimeline() {
        showMoment(1);
        addEventListeners();
        addScrollAnimations();
        addHeartAnimations();
        initMusicControl();
    }
    
    function initCalendar() {
        // Event listeners do calendário
        closeCalendar.addEventListener('click', hideCalendar);
        prevMonthBtn.addEventListener('click', () => changeMonth(-1));
        nextMonthBtn.addEventListener('click', () => changeMonth(1));
        addEventBtn.addEventListener('click', addEvent);
        
        // Event listeners dos temas
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = parseInt(btn.dataset.theme);
                changeTheme(theme);
            });
        });
        
        // Fechar modal clicando fora
        calendarModal.addEventListener('click', (e) => {
            if (e.target === calendarModal) {
                hideCalendar();
            }
        });
        
        // Enter para adicionar evento
        eventTitle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addEvent();
            }
        });
    }
    
    // Função global para mostrar calendário
    window.showCalendar = function(type) {
        currentCalendarType = type;
        currentTheme = calendarData[type].theme;
        
        // Configurar título e tema
        if (type === 'hero') {
            calendarTitle.textContent = 'Calendário do Herói';
            calendarContainer.className = 'calendar-container hero-theme';
        } else {
            calendarTitle.textContent = 'Calendário da Princesa';
            calendarContainer.className = 'calendar-container romance-theme';
        }
        
        // Atualizar botões de tema
        updateThemeButtons();
        
        // Mostrar modal
        calendarModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Renderizar calendário
        renderCalendar();
        renderEvents();
        
        // Definir data padrão no input
        eventDate.value = formatDateForInput(new Date());
    };
    
    function hideCalendar() {
        calendarModal.classList.add('hidden');
        document.body.style.overflow = '';
        currentCalendarType = null;
        selectedDate = null;
    }
    
    function changeMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar();
    }
    
    function changeTheme(theme) {
        if (!currentCalendarType) return;
        
        currentTheme = theme;
        calendarData[currentCalendarType].theme = theme;
        
        // Salvar no localStorage
        localStorage.setItem(`${currentCalendarType}-calendar-theme`, theme.toString());
        
        updateThemeButtons();
        updateCalendarTheme();
    }
    
    function updateThemeButtons() {
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.theme) === currentTheme);
        });
    }
    
    function updateCalendarTheme() {
        if (!currentCalendarType) return;
        
        const theme = themes[currentCalendarType][currentTheme];
        const [color1, color2] = theme.colors;
        
        // Atualizar cores do container
        calendarContainer.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
        
        // Adicionar efeitos especiais baseados no tema
        addThemeEffects();
    }
    
    function addThemeEffects() {
        // Remover efeitos anteriores
        const existingEffects = document.querySelectorAll('.theme-effect');
        existingEffects.forEach(effect => effect.remove());
        
        // Adicionar novos efeitos baseados no tema atual
        if (currentCalendarType === 'hero') {
            createHeroEffects();
        } else {
            createRomanceEffects();
        }
    }
    
    function createHeroEffects() {
        const effects = ['⚡', '💥', '🌟'];
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.className = 'theme-effect';
                effect.textContent = effects[Math.floor(Math.random() * effects.length)];
                effect.style.cssText = `
                    position: absolute;
                    font-size: 20px;
                    opacity: 0.3;
                    pointer-events: none;
                    z-index: 1;
                    left: ${Math.random() * 80 + 10}%;
                    top: ${Math.random() * 80 + 10}%;
                    animation: float 3s ease-in-out infinite;
                `;
                calendarContainer.appendChild(effect);
                
                setTimeout(() => effect.remove(), 3000);
            }, i * 1000);
        }
    }
    
    function createRomanceEffects() {
        const effects = ['💕', '🌸', '✨'];
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.className = 'theme-effect';
                effect.textContent = effects[Math.floor(Math.random() * effects.length)];
                effect.style.cssText = `
                    position: absolute;
                    font-size: 20px;
                    opacity: 0.3;
                    pointer-events: none;
                    z-index: 1;
                    left: ${Math.random() * 80 + 10}%;
                    top: ${Math.random() * 80 + 10}%;
                    animation: float 3s ease-in-out infinite;
                `;
                calendarContainer.appendChild(effect);
                
                setTimeout(() => effect.remove(), 3000);
            }, i * 1000);
        }
    }
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Atualizar título do mês
        currentMonthEl.textContent = `${months[month]} ${year}`;
        
        // Limpar dias anteriores
        calendarDays.innerHTML = '';
        
        // Primeiro dia do mês e último dia
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Dias do mês anterior
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayEl = createDayElement(daysInPrevMonth - i, true);
            calendarDays.appendChild(dayEl);
        }
        
        // Dias do mês atual
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = createDayElement(day, false);
            calendarDays.appendChild(dayEl);
        }
        
        // Dias do próximo mês
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells; // 6 semanas * 7 dias
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = createDayElement(day, true);
            calendarDays.appendChild(dayEl);
        }
    }
    
    function createDayElement(day, isOtherMonth) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        if (isOtherMonth) {
            dayEl.classList.add('other-month');
        }
        
        // Verificar se é hoje
        const today = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        if (!isOtherMonth && 
            day === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear()) {
            dayEl.classList.add('today');
        }
        
        // Verificar se tem eventos
        if (!isOtherMonth && hasEvent(currentYear, currentMonth, day)) {
            dayEl.classList.add('has-event');
        }
        
        // Event listener para seleção
        dayEl.addEventListener('click', () => {
            if (!isOtherMonth) {
                selectDate(currentYear, currentMonth, day);
            }
        });
        
        return dayEl;
    }
    
    function selectDate(year, month, day) {
        // Remover seleção anterior
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Adicionar seleção atual
        event.target.classList.add('selected');
        
        selectedDate = new Date(year, month, day);
        eventDate.value = formatDateForInput(selectedDate);
    }
    
    function hasEvent(year, month, day) {
        if (!currentCalendarType) return false;
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return calendarData[currentCalendarType].events.some(event => event.date === dateStr);
    }
    
    function addEvent() {
        if (!currentCalendarType || !eventTitle.value.trim() || !eventDate.value) {
            alert('Por favor, preencha o título e a data do evento.');
            return;
        }
        
        const newEvent = {
            id: Date.now(),
            title: eventTitle.value.trim(),
            date: eventDate.value
        };
        
        calendarData[currentCalendarType].events.push(newEvent);
        
        // Salvar no localStorage
        localStorage.setItem(`${currentCalendarType}-calendar-events`, 
            JSON.stringify(calendarData[currentCalendarType].events));
        
        // Limpar formulário
        eventTitle.value = '';
        eventDate.value = formatDateForInput(new Date());
        
        // Atualizar visualização
        renderCalendar();
        renderEvents();
        
        // Feedback visual
        addEventBtn.textContent = 'Adicionado!';
        addEventBtn.style.background = '#4ecdc4';
        setTimeout(() => {
            addEventBtn.textContent = 'Adicionar';
            addEventBtn.style.background = '';
        }, 1000);
    }
    
    function renderEvents() {
        if (!currentCalendarType) return;
        
        const events = calendarData[currentCalendarType].events;
        eventsList.innerHTML = '';
        
        if (events.length === 0) {
            eventsList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Nenhum evento adicionado ainda.</p>';
            return;
        }
        
        // Ordenar eventos por data
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        events.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = 'event-item';
            
            const eventInfo = document.createElement('div');
            eventInfo.className = 'event-info';
            
            const eventTitleEl = document.createElement('div');
            eventTitleEl.className = 'event-title';
            eventTitleEl.textContent = event.title;
            
            const eventDateEl = document.createElement('div');
            eventDateEl.className = 'event-date';
            eventDateEl.textContent = formatDateForDisplay(event.date);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-event';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => deleteEvent(event.id));
            
            eventInfo.appendChild(eventTitleEl);
            eventInfo.appendChild(eventDateEl);
            eventEl.appendChild(eventInfo);
            eventEl.appendChild(deleteBtn);
            
            eventsList.appendChild(eventEl);
        });
    }
    
    function deleteEvent(eventId) {
        if (!currentCalendarType) return;
        
        calendarData[currentCalendarType].events = 
            calendarData[currentCalendarType].events.filter(event => event.id !== eventId);
        
        // Salvar no localStorage
        localStorage.setItem(`${currentCalendarType}-calendar-events`, 
            JSON.stringify(calendarData[currentCalendarType].events));
        
        // Atualizar visualização
        renderCalendar();
        renderEvents();
    }
    
    function formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }
    
    function formatDateForDisplay(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    }
    
    // Inicializar controle de música
    function initMusicControl() {
        backgroundMusic.volume = 0.3;
        musicToggle.addEventListener('click', toggleMusic);
        tryAutoPlay();
        
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
        
        backgroundMusic.addEventListener('timeupdate', function() {
            if (isMusicPlaying) {
                const hearts = document.querySelectorAll('.heart');
                hearts.forEach(heart => {
                    heart.style.filter = `hue-rotate(${Math.sin(backgroundMusic.currentTime) * 30}deg)`;
                });
            }
        });
    }
    
    function tryAutoPlay() {
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('🎵 Música iniciada automaticamente');
            }).catch(error => {
                console.log('🔇 Reprodução automática bloqueada pelo navegador');
                musicToggle.classList.add('paused');
                musicIcon.textContent = '🔇';
            });
        }
    }
    
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
        
        musicToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            musicToggle.style.transform = '';
        }, 150);
    }
    
    // Mostrar momento específico
    function showMoment(momentNumber) {
        timelineItems.forEach(item => {
            item.classList.remove('active');
        });
        
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetItem = document.querySelector(`[data-moment="${momentNumber}"]`);
        const targetButton = document.querySelector(`[data-target="${momentNumber}"]`);
        
        if (targetItem && targetButton) {
            setTimeout(() => {
                targetItem.classList.add('active');
                targetButton.classList.add('active');
                currentMoment = momentNumber;
                
                targetItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
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
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const target = parseInt(this.getAttribute('data-target'));
                showMoment(target);
                
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        document.addEventListener('keydown', function(e) {
            // Não interferir se o modal do calendário estiver aberto
            if (!calendarModal.classList.contains('hidden')) {
                if (e.key === 'Escape') {
                    hideCalendar();
                }
                return;
            }
            
            if (e.key === 'ArrowLeft' && currentMoment > 1) {
                showMoment(currentMoment - 1);
            } else if (e.key === 'ArrowRight' && currentMoment < timelineItems.length) {
                showMoment(currentMoment + 1);
            } else if (e.key === ' ' && e.target.tagName !== 'INPUT') {
                toggleMusic();
                e.preventDefault();
            }
        });
        
        timelineItems.forEach((item, index) => {
            const image = item.querySelector('.moment-image');
            if (image) {
                image.addEventListener('click', function() {
                    const nextMoment = index === 0 ? 2 : 1;
                    showMoment(nextMoment);
                });
                
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
        
        const elementsToAnimate = document.querySelectorAll('.moment-card, .header, .navigation, .footer, .calendars-section');
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
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        console.log('💕 Site do casal carregado com amor!');
        console.log('Use as setas do teclado ou os botões para navegar');
        console.log('Clique nas imagens para ver efeitos especiais!');
        console.log('📅 Calendários personalizados disponíveis!');
    }, 1000);
});

