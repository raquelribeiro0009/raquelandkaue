// Variáveis globais
let currentDate = new Date();
let currentTheme = 'batman';
let events = JSON.parse(localStorage.getItem('heroEvents')) || {};
let selectedEventDate = null;

// Temas dos super-heróis
const themes = {
    batman: {
        colors: ['#1a1a2e', '#16213e', '#0f3460'],
        accent: '#ffd700',
        icon: '🦇'
    },
    spiderman: {
        colors: ['#dc143c', '#b22222', '#8b0000'],
        accent: '#0066ff',
        icon: '🕷️'
    },
    superman: {
        colors: ['#0066cc', '#004499', '#003366'],
        accent: '#ff0000',
        icon: '🦸‍♂️'
    }
};

// Meses em português
const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Dias da semana
const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Inicializar calendário
document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
    updateTheme();
    
    // Adicionar efeitos especiais
    addHeroEffects();
});

// Gerar calendário
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Atualizar título do mês/ano
    document.getElementById('month-year').textContent = `${months[month]} ${year}`;
    
    // Limpar grid
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    // Adicionar cabeçalhos dos dias
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Primeiro dia do mês e último dia do mês anterior
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const lastDatePrevMonth = new Date(year, month, 0).getDate();
    
    // Adicionar dias do mês anterior
    for (let i = firstDay - 1; i >= 0; i--) {
        const dateElement = createDateElement(lastDatePrevMonth - i, true, year, month - 1);
        calendarGrid.appendChild(dateElement);
    }
    
    // Adicionar dias do mês atual
    for (let date = 1; date <= lastDate; date++) {
        const dateElement = createDateElement(date, false, year, month);
        calendarGrid.appendChild(dateElement);
    }
    
    // Adicionar dias do próximo mês para completar a grade
    const totalCells = calendarGrid.children.length - 7; // Subtrair cabeçalhos
    const remainingCells = 42 - totalCells; // 6 semanas * 7 dias
    
    for (let date = 1; date <= remainingCells; date++) {
        const dateElement = createDateElement(date, true, year, month + 1);
        calendarGrid.appendChild(dateElement);
    }
}

// Criar elemento de data
function createDateElement(date, isOtherMonth, year, month) {
    const dateElement = document.createElement('div');
    dateElement.className = 'calendar-date';
    dateElement.textContent = date;
    
    const dateKey = `${year}-${month + 1}-${date}`;
    const today = new Date();
    
    if (isOtherMonth) {
        dateElement.classList.add('other-month');
    } else {
        // Verificar se é hoje
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            date === today.getDate()) {
            dateElement.classList.add('today');
        }
        
        // Verificar se tem evento
        if (events[dateKey]) {
            dateElement.classList.add('has-event');
            dateElement.title = events[dateKey].title;
        }
        
        // Adicionar event listener
        dateElement.addEventListener('click', () => {
            if (events[dateKey]) {
                showEventModal(dateKey);
            }
        });
    }
    
    return dateElement;
}

// Mudar mês
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    generateCalendar();
    
    // Efeito visual
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.style.transform = `translateX(${direction * 20}px)`;
    calendarGrid.style.opacity = '0.7';
    
    setTimeout(() => {
        calendarGrid.style.transform = 'translateX(0)';
        calendarGrid.style.opacity = '1';
    }, 150);
}

// Mudar tema
function changeTheme(theme) {
    currentTheme = theme;
    
    // Atualizar botões ativos
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    
    updateTheme();
    
    // Efeito visual
    document.body.style.filter = 'hue-rotate(45deg)';
    setTimeout(() => {
        document.body.style.filter = 'none';
    }, 300);
}

// Atualizar tema visual
function updateTheme() {
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // Atualizar variáveis CSS
    root.style.setProperty('--theme-primary', theme.colors[0]);
    root.style.setProperty('--theme-secondary', theme.colors[1]);
    root.style.setProperty('--theme-tertiary', theme.colors[2]);
    root.style.setProperty('--theme-accent', theme.accent);
    
    // Atualizar background do body
    document.body.style.background = `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 50%, ${theme.colors[2]} 100%)`;
}

// Adicionar evento
function addEvent() {
    const dateInput = document.getElementById('event-date');
    const titleInput = document.getElementById('event-title');
    
    if (!dateInput.value || !titleInput.value.trim()) {
        alert('Por favor, preencha a data e o título do evento.');
        return;
    }
    
    const date = new Date(dateInput.value + 'T00:00:00');
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    events[dateKey] = {
        title: titleInput.value.trim(),
        date: dateInput.value,
        theme: currentTheme
    };
    
    // Salvar no localStorage
    localStorage.setItem('heroEvents', JSON.stringify(events));
    
    // Limpar formulário
    dateInput.value = '';
    titleInput.value = '';
    
    // Regenerar calendário
    generateCalendar();
    
    // Efeito visual
    showSuccessMessage('Evento adicionado com sucesso!');
}

// Mostrar modal do evento
function showEventModal(dateKey) {
    const event = events[dateKey];
    selectedEventDate = dateKey;
    
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    
    const theme = themes[event.theme];
    
    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">${theme.icon}</div>
            <h4 style="font-size: 1.5rem; color: ${theme.accent}; margin-bottom: 10px;">${event.title}</h4>
            <p style="color: #666; font-size: 1.1rem;">Data: ${formatDate(event.date)}</p>
            <p style="color: #666; font-size: 1rem;">Tema: ${event.theme.charAt(0).toUpperCase() + event.theme.slice(1)}</p>
        </div>
    `;
    
    modal.classList.add('show');
}

// Fechar modal
function closeModal() {
    document.getElementById('event-modal').classList.remove('show');
    selectedEventDate = null;
}

// Excluir evento
function deleteEvent() {
    if (selectedEventDate && events[selectedEventDate]) {
        delete events[selectedEventDate];
        localStorage.setItem('heroEvents', JSON.stringify(events));
        generateCalendar();
        closeModal();
        showSuccessMessage('Evento excluído com sucesso!');
    }
}

// Voltar para página principal
function goBack() {
    window.location.href = 'index.html';
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Adicionar efeitos especiais de super-herói
function addHeroEffects() {
    // Efeito de partículas
    setInterval(() => {
        createHeroParticle();
    }, 2000);
    
    // Efeito de brilho nos ícones
    const icons = document.querySelectorAll('.hero-icon');
    icons.forEach((icon, index) => {
        setInterval(() => {
            icon.style.filter = 'drop-shadow(0 0 20px #ffd700) brightness(1.5)';
            setTimeout(() => {
                icon.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))';
            }, 500);
        }, 3000 + (index * 1000));
    });
}

// Criar partícula de super-herói
function createHeroParticle() {
    const particle = document.createElement('div');
    const icons = ['⚡', '💥', '✨', '🌟'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    particle.innerHTML = randomIcon;
    particle.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight}px;
        animation: heroParticleFloat 4s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (document.body.contains(particle)) {
            document.body.removeChild(particle);
        }
    }, 4000);
}

// CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes heroParticleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

