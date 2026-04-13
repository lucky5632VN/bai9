// --- Supabase Config ---
const SUPABASE_URL = 'https://hzlhgicztcphkouvhqdc.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_AEJiMwKnp4djhU7KJ3UgZQ_2qyaJL_W'; 

let supabaseClient = null;
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    const { createClient } = supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// State management
let currentState = {
    view: 'login',
    user: null,
    currentSection: 1,
    currentQuestionId: 1,
    answers: { part1: {}, part2: {}, part3: {} },
    timeLeft: 30 * 60,
    timerInterval: null,
    violations: 0,
    startTime: null
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initLogin();
    setupAntiCheat();
    setupMobileNav();
});

function switchView(viewName) {
    const allViews = document.querySelectorAll('.view');
    allViews.forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(`${viewName}-view`);
    target.classList.remove('hidden');
    currentState.view = viewName;
    window.scrollTo(0, 0);
    lucide.createIcons();
}

// --- Auth / Login ---
function initLogin() {
    const classSelect = document.getElementById('class-select');
    const nameSelect = document.getElementById('name-select');
    const studentForm = document.getElementById('student-login-form');
    const teacherForm = document.getElementById('teacher-login-form');

    classSelect.addEventListener('change', (e) => {
        const cls = e.target.value;
        nameSelect.innerHTML = '<option value="">-- Chọn tên --</option>';
        if (cls && STUDENT_DATA[cls]) {
            STUDENT_DATA[cls].forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.name;
                opt.textContent = s.name;
                nameSelect.appendChild(opt);
            });
            nameSelect.disabled = false;
        } else {
            nameSelect.disabled = true;
        }
    });

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cls = classSelect.value;
        const name = nameSelect.value;
        const pass = document.getElementById('student-password').value;
        const student = STUDENT_DATA[cls].find(s => s.name === name && s.password === pass);
        if (student) {
            currentState.user = { type: 'student', data: { ...student, class: cls } };
            startQuiz();
        } else {
            document.getElementById('student-error').classList.remove('hidden');
        }
    });

    teacherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('teacher-password').value;
        if (pass === '10101988') {
            currentState.user = { type: 'teacher' };
            initDashboard();
        } else {
            document.getElementById('teacher-error').classList.remove('hidden');
        }
    });
}

// --- Quiz Engine ---
function startQuiz() {
    switchView('quiz');
    document.getElementById('display-student-name').textContent = currentState.user.data.name;
    document.getElementById('display-student-class').textContent = currentState.user.data.class;
    document.getElementById('res-name').textContent = currentState.user.data.name;
    document.getElementById('res-class').textContent = currentState.user.data.class;
    
    currentState.startTime = new Date();
    renderNavigator();
    renderQuestions();
    startTimer();
}

function startTimer() {
    const timerText = document.getElementById('timer-text');
    currentState.timerInterval = setInterval(() => {
        currentState.timeLeft--;
        const m = Math.floor(currentState.timeLeft / 60);
        const s = currentState.timeLeft % 60;
        timerText.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function renderNavigator() {
    const desktopNav = document.getElementById('desktop-navigator');
    const mobileNav = document.getElementById('mobile-navigator');
    
    const navContent = `
        <div>
            <div class="text-[10px] text-cyan-400 mb-3 font-bold">PHẦN I (0.25đ/câu)</div>
            <div class="nav-grid">${QUIZ_DATA.part1.map(q => createNavDotHTML(q, 1)).join('')}</div>
        </div>
        <div>
            <div class="text-[10px] text-purple-400 mb-3 font-bold">PHẦN II (Đúng / Sai)</div>
            <div class="nav-grid">${QUIZ_DATA.part2.map(q => createNavDotHTML(q, 2)).join('')}</div>
        </div>
        <div>
            <div class="text-[10px] text-orange-400 mb-3 font-bold">PHẦN III (Trả lời ngắn)</div>
            <div class="nav-grid">${QUIZ_DATA.part3.map(q => createNavDotHTML(q, 3)).join('')}</div>
        </div>
    `;

    desktopNav.innerHTML = navContent;
    mobileNav.innerHTML = navContent;
}

function createNavDotHTML(q, section) {
    const isCurrent = currentState.currentSection === section && currentState.currentQuestionId === q.id;
    let isAnswered = false;
    if (section === 1) isAnswered = !!currentState.answers.part1[q.id];
    if (section === 2) isAnswered = currentState.answers.part2[q.id] && currentState.answers.part2[q.id].every(v => v !== null);
    if (section === 3) isAnswered = currentState.answers.part3[q.id] && currentState.answers.part3[q.id].trim() !== '';

    let classes = 'nav-dot';
    if (isCurrent) classes += ' active';
    else if (isAnswered) classes += ' answered';

    return `<div class="${classes}" onclick="jumpTo(${section}, ${q.id})">${q.id}</div>`;
}

window.jumpTo = (section, qId) => {
    currentState.currentSection = section;
    currentState.currentQuestionId = qId;
    closeDrawer();
    renderQuestions(true);
};

function renderQuestions(shouldScroll = false) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    const section = currentState.currentSection;
    const currentQuestions = section === 1 ? QUIZ_DATA.part1 : section === 2 ? QUIZ_DATA.part2 : QUIZ_DATA.part3;

    currentQuestions.forEach(q => {
        const isActive = q.id === currentState.currentQuestionId;
        const card = document.createElement('div');
        card.className = `question-card glass-card ${isActive ? 'border-cyan-400' : ''}`;
        card.id = `q-${section}-${q.id}`;
        
        if (section === 1) {
            card.innerHTML = `
                <div class="text-[10px] text-cyan-400 font-bold mb-4 uppercase tracking-widest">PHẦN I - CÂU ${q.id}</div>
                <p class="text-md md:text-lg font-semibold mb-8 leading-relaxed">${q.question}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${['A', 'B', 'C', 'D'].map((opt, i) => `
                        <button class="opt-btn ${currentState.answers.part1[q.id] === opt ? 'selected' : ''}" onclick="selectP1(${q.id}, '${opt}')">
                            <span class="inline-block w-8 font-sci font-bold">${opt}.</span> ${q.options[i]}
                        </button>
                    `).join('')}
                </div>
            `;
        } else if (section === 2) {
            card.innerHTML = `
                <div class="text-[10px] text-purple-400 font-bold mb-4 uppercase tracking-widest">PHẦN II - CÂU ${q.id}</div>
                <p class="text-md md:text-lg font-semibold mb-10 leading-relaxed">${q.question}</p>
                <div class="space-y-4">
                    ${q.subQuestions.map((sq, idx) => {
                        const val = (currentState.answers.part2[q.id] || [])[idx];
                        return `
                        <div class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 gap-4">
                            <span class="text-slate-300 text-sm flex-grow">${sq.text}</span>
                            <div class="flex gap-2">
                                <button class="px-5 py-2 rounded-xl text-xs font-bold border transition-all ${val === true ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 border-white/10 text-slate-500'}" onclick="selectP2(${q.id}, ${idx}, true)">ĐÚNG</button>
                                <button class="px-5 py-2 rounded-xl text-xs font-bold border transition-all ${val === false ? 'bg-purple-500 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-500'}" onclick="selectP2(${q.id}, ${idx}, false)">SAI</button>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="text-[10px] text-orange-400 font-bold mb-4 uppercase tracking-widest">PHẦN III - CÂU ${q.id}</div>
                <p class="text-md md:text-lg font-semibold mb-8 leading-relaxed">${q.question}</p>
                <div class="relative">
                    <input type="text" class="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-400 transition-all font-bold" 
                           placeholder="Nhập đáp án..." value="${currentState.answers.part3[q.id] || ''}" 
                           onchange="selectP3(${q.id}, this.value)">
                </div>
            `;
        }
        container.appendChild(card);
        if (isActive && shouldScroll) setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    });

    updateProgress();
    updateNavButtons();
    renderNavigator();
}

function updateProgress() {
    const total = QUIZ_DATA.part1.length + QUIZ_DATA.part2.length + QUIZ_DATA.part3.length;
    let answered = 0;
    answered += Object.keys(currentState.answers.part1).length;
    Object.values(currentState.answers.part2).forEach(v => { if (v && v.every(x => x !== null)) answered++; });
    Object.values(currentState.answers.part3).forEach(v => { if (v && v.trim() !== '') answered++; });

    const pct = Math.round((answered / total) * 100);
    document.getElementById('progress-fill').style.width = `${pct}%`;
    document.getElementById('progress-text').textContent = `${pct}%`;
}

window.selectP1 = (qId, opt) => { currentState.answers.part1[qId] = opt; renderQuestions(); };
window.selectP2 = (qId, idx, val) => {
    if (!currentState.answers.part2[qId]) currentState.answers.part2[qId] = [null, null, null, null];
    currentState.answers.part2[qId][idx] = val;
    renderQuestions();
};
window.selectP3 = (qId, val) => { currentState.answers.part3[qId] = val; updateProgress(); renderNavigator(); };

// --- Mobile Navigation Logic ---
function setupMobileNav() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('nav-overlay');
    const close = document.getElementById('close-drawer');

    if (toggle) toggle.onclick = () => { drawer.classList.add('open'); overlay.classList.add('open'); };
    if (close) close.onclick = closeDrawer;
    if (overlay) overlay.onclick = closeDrawer;
}

function closeDrawer() {
    document.getElementById('nav-drawer').classList.remove('open');
    document.getElementById('nav-overlay').classList.remove('open');
}

// --- Leaderboard Sync ---
async function fetchResults() {
    if (!supabaseClient) {
        return JSON.parse(localStorage.getItem('quiz_results') || '[]');
    }
    const { data, error } = await supabaseClient
        .from('quiz_results')
        .select('*')
        .order('score', { ascending: false })
        .order('timestamp', { ascending: true });
    
    if (error) {
        console.error('Database error:', error);
        return JSON.parse(localStorage.getItem('quiz_results') || '[]');
    }
    return data;
}

async function showLeaderboard() {
    switchView('leaderboard');
    const body = document.getElementById('leaderboard-body');
    body.innerHTML = '<tr><td colspan="4" class="p-10 text-center text-muted italic">Đang tải dữ liệu...</td></tr>';
    
    const results = await fetchResults();
    body.innerHTML = '';
    
    if (results.length === 0) {
        body.innerHTML = '<tr><td colspan="4" class="p-10 text-center text-muted italic">Chưa có kết quả nào</td></tr>';
        return;
    }

    results.slice(0, 50).forEach((res, index) => {
        const rank = index + 1;
        let rankClass = 'rank-other';
        if (rank === 1) rankClass = 'rank-1';
        else if (rank === 2) rankClass = 'rank-2';
        else if (rank === 3) rankClass = 'rank-3';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-6">
                <div class="rank-badge ${rankClass}">${rank}</div>
            </td>
            <td class="p-6">
                <div class="font-bold text-white">${res.name}</div>
                <div class="text-[10px] text-muted uppercase">${res.class}</div>
            </td>
            <td class="p-6 text-center">
                <span class="score-pill">${res.score.toFixed(2)}</span>
            </td>
            <td class="p-6 text-right text-muted text-xs">
                ${new Date(res.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </td>
        `;
        body.appendChild(row);
    });
}
window.showLeaderboard = showLeaderboard;

// --- Prev/Next Buttons ---
function updateNavButtons() {
    const prev = document.getElementById('prev-btn');
    const next = document.getElementById('next-btn');
    const submit = document.getElementById('submit-btn');
    if (!prev) return;

    const s = currentState.currentSection;
    const qid = currentState.currentQuestionId;
    
    prev.classList.toggle('hidden', s === 1 && qid === 1);
    next.classList.toggle('hidden', s === 3 && qid === QUIZ_DATA.part3.length);
    submit.classList.toggle('hidden', !(s === 3 && qid === QUIZ_DATA.part3.length));
}

document.getElementById('next-btn').onclick = () => {
    const s = currentState.currentSection;
    const qid = currentState.currentQuestionId;
    if (qid < QUIZ_DATA[`part${s}`].length) currentState.currentQuestionId++;
    else if (s < 3) { currentState.currentSection++; currentState.currentQuestionId = 1; }
    renderQuestions(true);
};

document.getElementById('prev-btn').onclick = () => {
    const s = currentState.currentSection;
    const qid = currentState.currentQuestionId;
    if (qid > 1) currentState.currentQuestionId--;
    else if (s > 1) { currentState.currentSection--; currentState.currentQuestionId = QUIZ_DATA[`part${currentState.currentSection}`].length; }
    renderQuestions(true);
};

document.getElementById('submit-btn').onclick = () => {
    const allP1 = QUIZ_DATA.part1.every(q => currentState.answers.part1[q.id]);
    const allP2 = QUIZ_DATA.part2.every(q => currentState.answers.part2[q.id] && currentState.answers.part2[q.id].every(v => v !== null));
    const allP3 = QUIZ_DATA.part3.every(q => currentState.answers.part3[q.id] && currentState.answers.part3[q.id].trim() !== '');

    if (allP1 && allP2 && allP3) { if (confirm('Xác nhận nộp bài?')) submitQuiz(); }
    else alert('Vui lòng hoàn thành mọi câu hỏi!');
};

// --- Results & Dashboard ---
async function submitQuiz() {
    clearInterval(currentState.timerInterval);
    let score = 0;
    QUIZ_DATA.part1.forEach(q => { if (currentState.answers.part1[q.id] === q.answer) score += 0.25; });
    QUIZ_DATA.part2.forEach(q => {
        let count = 0;
        q.subQuestions.forEach((sq, i) => { if (currentState.answers.part2[q.id] && currentState.answers.part2[q.id][i] === sq.answer) count++; });
        if (count === 1) score += 0.1; else if (count === 2) score += 0.25; else if (count === 3) score += 0.5; else if (count === 4) score += 1.0;
    });
    QUIZ_DATA.part3.forEach(q => {
        const studentAns = (currentState.answers.part3[q.id] || '').toString().trim().replace(',', '.');
        const correctAns = q.answer.toString().trim().replace(',', '.');
        if (parseFloat(studentAns) === parseFloat(correctAns)) score += 0.25;
    });

    const final = Math.round(score * 100) / 100;
    document.getElementById('final-score').textContent = final.toFixed(2);
    document.getElementById('final-feedback').textContent = final >= 8 ? "XUẤT SẮC" : final >= 5 ? "ĐẠT YÊU CẦU" : "CẦN CỐ GẮNG";
    
    const resultObj = { 
        name: currentState.user.data.name, 
        class: currentState.user.data.class, 
        score: final, 
        violations: currentState.violations, 
        timestamp: new Date().toISOString() 
    };

    // Save to Local
    const hist = JSON.parse(localStorage.getItem('quiz_results') || '[]');
    hist.push(resultObj);
    localStorage.setItem('quiz_results', JSON.stringify(hist));

    // Save to Cloud
    if (supabaseClient) {
        const { error } = await supabaseClient.from('quiz_results').insert([resultObj]);
        if (error) console.error('Cloud Save Error:', error);
    }
    
    switchView('result');
}

// --- Anti-Cheat ---
function setupAntiCheat() {
    document.addEventListener('visibilitychange', () => {
        if (currentState.view === 'quiz' && document.visibilityState === 'hidden') {
            currentState.violations++;
            document.getElementById('cheat-warning').classList.remove('hidden');
            document.getElementById('violation-count').textContent = currentState.violations;
            if (currentState.violations >= 3) { submitQuiz(); showAlert('Vi phạm quá 3 lần. Hệ thống tự động nộp bài!'); }
            else showAlert(`CẢNH BÁO: Không được rời khỏi tab thi! (${currentState.violations}/3)`);
        }
    });
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('copy', e => e.preventDefault());
}

function showAlert(msg) {
    document.getElementById('alert-msg').textContent = msg;
    document.getElementById('alert-modal').classList.remove('hidden');
}
document.getElementById('alert-btn').onclick = () => document.getElementById('alert-modal').classList.add('hidden');

// --- Dashboard ---
let myChart = null;
async function initDashboard() {
    switchView('dashboard');
    updateDashboard();
    setInterval(updateDashboard, 10000);
}

async function updateDashboard() {
    const history = await fetchResults();
    document.getElementById('kpi-total').textContent = `${history.length}/110`;
    document.getElementById('kpi-rate').textContent = `${(history.length/110*100).toFixed(1)}% tham gia`;
    
    if (history.length > 0) {
        const scores = history.map(h => h.score);
        document.getElementById('kpi-avg').textContent = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
        document.getElementById('kpi-violation').textContent = (history.reduce((a, b) => a + b.violations, 0) / history.length).toFixed(1);
    }

    const dist = Array(11).fill(0);
    history.forEach(h => dist[Math.floor(h.score)]++);
    
    const ctx = document.getElementById('score-chart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            datasets: [{ label: 'Học sinh', data: dist, backgroundColor: 'rgba(34, 211, 238, 0.4)', borderColor: '#22d3ee', borderWidth: 1, borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
    });

    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = '';
    [...history].reverse().slice(0, 30).forEach(h => {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="p-4 md:p-6 text-muted">${new Date(h.timestamp).toLocaleTimeString()}</td><td class="p-4 md:p-6 font-bold truncate max-w-[150px]">${h.class} - ${h.name}</td><td class="p-4 md:p-6 font-sci text-cyan-400">${h.score.toFixed(2)}</td><td class="p-4 md:p-6 text-orange-400 font-bold">${h.violations}</td>`;
        tbody.appendChild(row);
    });

    const live = document.getElementById('live-activity');
    live.innerHTML = '';
    history.slice(-5).reverse().forEach(h => {
        const item = document.createElement('div');
        item.className = 'flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5';
        item.innerHTML = `<div class="w-8 h-8 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center font-bold text-xs">${h.score.toFixed(0)}</div><div><p class="text-xs font-bold text-white">${h.name}</p><p class="text-[9px] text-muted">${h.class} • ${new Date(h.timestamp).toLocaleTimeString()}</p></div>`;
        live.appendChild(item);
    });
}
document.getElementById('logout-btn').onclick = () => location.reload();
