// --- Supabase Config ---
const SUPABASE_URL = 'https://hzlhgicztcphkouvhqdc.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_AEJiMwKnp4djhU7KJ3UgZQ_2qyaJL_W'; 

let supabaseClient = null;
if (SUPABASE_URL.includes('hzlhgicztc')) {
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

let dashboardState = {
    activeClass: 'all'
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
    const loginBtn = document.getElementById('login-btn');
    const attemptWarning = document.getElementById('attempt-warning');

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
        attemptWarning.classList.add('hidden');
        loginBtn.disabled = false;
    });

    nameSelect.addEventListener('change', async () => {
        const cls = classSelect.value;
        const name = nameSelect.value;
        if (cls && name && supabaseClient) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'ĐANG KIỂM TRA...';
            
            const { data, error } = await supabaseClient
                .from('quiz_results')
                .select('id')
                .eq('name', name)
                .eq('class', cls);
            
            if (data && data.length > 0) {
                attemptWarning.classList.remove('hidden');
                loginBtn.textContent = 'ĐÃ HOÀN THÀNH';
            } else {
                attemptWarning.classList.add('hidden');
                loginBtn.disabled = false;
                loginBtn.textContent = 'VÀO PHÒNG THI';
            }
        }
    });

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (loginBtn.disabled) return;
        
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
    const timerPill = document.getElementById('quiz-timer');
    currentState.timerInterval = setInterval(() => {
        currentState.timeLeft--;
        const m = Math.floor(currentState.timeLeft / 60);
        const s = currentState.timeLeft % 60;
        timerText.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;

        // Visual urgency states
        timerPill.classList.remove('warning', 'danger');
        if (currentState.timeLeft <= 120) {
            timerPill.classList.add('danger');   // last 2 min — red + pulse
        } else if (currentState.timeLeft <= 300) {
            timerPill.classList.add('warning');  // last 5 min — orange
        }

        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function renderNavigator() {
    const desktopNav = document.getElementById('desktop-navigator');
    const mobileNav  = document.getElementById('mobile-navigator');

    const makeDots = (questions, section) =>
        questions.map(q => createNavDotHTML(q, section)).join('');

    const navContent = `
        <div style="margin-bottom:1rem;">
            <div style="font-size:0.58rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem;padding-bottom:0.4rem;border-bottom:1px solid #eff6ff;">Phần I</div>
            <div class="nav-grid">${makeDots(QUIZ_DATA.part1, 1)}</div>
        </div>
        <div style="margin-bottom:1rem;">
            <div style="font-size:0.58rem;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem;padding-bottom:0.4rem;border-bottom:1px solid #f5f3ff;">Phần II</div>
            <div class="nav-grid">${makeDots(QUIZ_DATA.part2, 2)}</div>
        </div>
        <div style="margin-bottom:0.25rem;">
            <div style="font-size:0.58rem;font-weight:800;color:#ea580c;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem;padding-bottom:0.4rem;border-bottom:1px solid #fff7ed;">Phần III</div>
            <div class="nav-grid">${makeDots(QUIZ_DATA.part3, 3)}</div>
        </div>
    `;
    if (desktopNav) desktopNav.innerHTML = navContent;
    if (mobileNav)  mobileNav.innerHTML  = navContent;
}

function createNavDotHTML(q, section) {
    let isAnswered = false;
    if (section === 1) isAnswered = !!currentState.answers.part1[q.id];
    if (section === 2) isAnswered = currentState.answers.part2[q.id] && currentState.answers.part2[q.id].some(v => v !== null);
    if (section === 3) isAnswered = !!(currentState.answers.part3[q.id] && currentState.answers.part3[q.id].trim());

    const cls = isAnswered ? 'nav-dot answered' : 'nav-dot';
    return `<div class="${cls}" onclick="jumpTo(${section}, ${q.id})">${q.id}</div>`;
}

window.jumpTo = (section, qId) => {
    closeDrawer();
    const el = document.getElementById(`q-${section}-${qId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

function renderQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    // ── Section divider helper ──
    function makeDivider(label, color, textColor) {
        const d = document.createElement('div');
        d.style.cssText = `display:flex;align-items:center;gap:0.75rem;margin:2rem 0 1rem;`;
        d.innerHTML = `
            <div style="width:4px;height:32px;background:${color};border-radius:4px;flex-shrink:0;"></div>
            <div>
                <div style="font-family:'Orbitron',sans-serif;font-size:0.72rem;font-weight:800;color:#0f172a;letter-spacing:0.04em;">${label}</div>
                <div style="font-size:0.6rem;color:${textColor};font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-top:1px;">Kết quả sẽ được ghi nhận tự động</div>
            </div>`;
        return d;
    }

    // ── PART 1 ──
    container.appendChild(makeDivider('Phần I — Trắc nghiệm (0.25 đ/câu)', 'linear-gradient(180deg,#2563eb,#60a5fa)', '#2563eb'));
    QUIZ_DATA.part1.forEach(q => {
        const card = document.createElement('div');
        card.className = 'question-card glass-card';
        card.id = `q-1-${q.id}`;
        card.innerHTML = `
            <div style="font-size:0.62rem;color:#2563eb;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid #eff6ff;">
                Câu ${q.id}
            </div>
            <p style="font-size:1rem;font-weight:700;color:#1e293b;margin-bottom:1.5rem;line-height:1.7;">${q.question}</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                ${['A','B','C','D'].map((opt, i) => `
                    <button class="opt-btn ${currentState.answers.part1[q.id] === opt ? 'selected' : ''}" onclick="selectP1(${q.id}, '${opt}')">
                        <span style="font-family:'Orbitron',sans-serif;font-weight:800;opacity:0.5;margin-right:0.5rem;font-size:0.75rem;">${opt}.</span>${q.options[i]}
                    </button>`).join('')}
            </div>`;
        container.appendChild(card);
    });

    // ── PART 2 ──
    container.appendChild(makeDivider('Phần II — Đúng / Sai (0.1  → 1.0 đ/câu)', 'linear-gradient(180deg,#7c3aed,#a78bfa)', '#7c3aed'));
    QUIZ_DATA.part2.forEach(q => {
        const card = document.createElement('div');
        card.className = 'question-card glass-card';
        card.id = `q-2-${q.id}`;
        card.innerHTML = `
            <div style="font-size:0.62rem;color:#7c3aed;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid #f5f3ff;">
                Câu ${q.id}
            </div>
            <p style="font-size:1rem;font-weight:700;color:#1e293b;margin-bottom:1.5rem;line-height:1.7;">${q.question}</p>
            <div style="display:flex;flex-direction:column;gap:0.625rem;">
                ${q.subQuestions.map((sq, idx) => {
                    const val = (currentState.answers.part2[q.id] || [])[idx];
                    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1rem;background:#f8fafc;border-radius:0.75rem;border:1px solid #e2e8f0;gap:1rem;">
                        <span style="color:#334155;font-size:0.875rem;font-weight:500;flex:1;">${sq.text}</span>
                        <div style="display:flex;gap:0.4rem;flex-shrink:0;">
                            <button style="padding:0.35rem 0.875rem;border-radius:0.5rem;font-size:0.7rem;font-weight:800;border:1.5px solid;transition:all 0.18s;cursor:pointer;${val===true ? 'background:#2563eb;color:#fff;border-color:#2563eb;' : 'background:#fff;color:#94a3b8;border-color:#e2e8f0;'}" onclick="selectP2(${q.id},${idx},true)">ĐÚNG</button>
                            <button style="padding:0.35rem 0.875rem;border-radius:0.5rem;font-size:0.7rem;font-weight:800;border:1.5px solid;transition:all 0.18s;cursor:pointer;${val===false ? 'background:#7c3aed;color:#fff;border-color:#7c3aed;' : 'background:#fff;color:#94a3b8;border-color:#e2e8f0;'}" onclick="selectP2(${q.id},${idx},false)">SAI</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        container.appendChild(card);
    });

    // ── PART 3 ──
    container.appendChild(makeDivider('Phần III — Tự luận ngắn (0.25 đ/câu)', 'linear-gradient(180deg,#ea580c,#fb923c)', '#ea580c'));
    QUIZ_DATA.part3.forEach(q => {
        const card = document.createElement('div');
        card.className = 'question-card glass-card';
        card.id = `q-3-${q.id}`;
        card.innerHTML = `
            <div style="font-size:0.62rem;color:#ea580c;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid #fff7ed;">
                Câu ${q.id}
            </div>
            <p style="font-size:1rem;font-weight:700;color:#1e293b;margin-bottom:1.5rem;line-height:1.7;">${q.question}</p>
            <input type="text" 
                style="width:100%;max-width:320px;background:#fff;border:2px solid #e2e8f0;padding:0.75rem 1rem;border-radius:0.75rem;color:#1e293b;font-weight:700;font-size:0.95rem;outline:none;transition:border-color 0.2s;" 
                placeholder="Nhập số..." 
                value="${currentState.answers.part3[q.id] || ''}" 
                onchange="selectP3(${q.id}, this.value)"
                onfocus="this.style.borderColor='#ea580c'"
                onblur="this.style.borderColor='#e2e8f0'">`;
        container.appendChild(card);
    });

    renderNavigator();
    lucide.createIcons();
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
window.selectP3 = (qId, val) => { currentState.answers.part3[qId] = val; renderQuestions(); };

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

// --- Leaderboard & Persistence ---
async function fetchResults() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
        .from('quiz_results')
        .select('*')
        .order('score', { ascending: false })
        .order('timestamp', { ascending: true });
    return error ? [] : data;
}

async function showLeaderboard() {
    switchView('leaderboard');
    lucide.createIcons();

    const body    = document.getElementById('leaderboard-body');
    const podium  = document.getElementById('lb-podium');
    const counter = document.getElementById('lb-total-count');

    body.innerHTML   = '<tr><td colspan="5" style="padding:3rem;text-align:center;color:#94a3b8;font-weight:600;">Đang tải dữ liệu...</td></tr>';
    if (podium)  podium.innerHTML  = '';
    if (counter) counter.textContent = '...';

    const results = await fetchResults();

    if (counter) counter.textContent = `${results.length} thí sinh`;

    // ── Podium (top 3) ──
    if (podium) {
        if (results.length === 0) {
            podium.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:2rem;font-size:0.85rem;">Chưa có dữ liệu xếp hạng.</div>';
        } else {
            // Display order: 2nd | 1st | 3rd  (classic podium layout)
            const order = [results[1], results[0], results[2]].filter(Boolean);
            const rankMap = { 0: 2, 1: 1, 2: 3 };  // index in order → actual rank
            const scoreClass = ['silver', 'gold', 'bronze'];
            const rankBadgeClass = ['lb-rank-2', 'lb-rank-1', 'lb-rank-3'];
            const rankLabel = ['2', '1', '3'];

            order.forEach((res, i) => {
                const actualRank = (results.indexOf(res) + 1);
                const sc = actualRank === 1 ? 'gold' : actualRank === 2 ? 'silver' : 'bronze';
                const badgeCls = actualRank === 1 ? 'lb-rank-1' : actualRank === 2 ? 'lb-rank-2' : 'lb-rank-3';
                const card = document.createElement('div');
                card.className = `lb-podium-card rank-${actualRank}`;
                card.innerHTML = `
                    <div class="lb-rank-badge ${badgeCls}">${actualRank}</div>
                    <div class="lb-podium-name">${res.name}</div>
                    <div class="lb-podium-class">${res.class}</div>
                    <div class="lb-podium-score-bar">
                        <div class="lb-podium-score ${sc}">${res.score.toFixed(2)}</div>
                        <div class="lb-podium-score-label">Điểm số</div>
                    </div>
                `;
                podium.appendChild(card);
            });
        }
    }

    // ── Full Rankings Table ──
    body.innerHTML = '';
    if (results.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="padding:3rem;text-align:center;color:#94a3b8;">Chưa có bài nộp nào.</td></tr>';
        return;
    }

    const rankEmoji = ['🥇', '🥈', '🥉'];
    const topClass  = ['lb-top1', 'lb-top2', 'lb-top3'];

    results.forEach((res, index) => {
        const rank = index + 1;
        const row = document.createElement('tr');
        if (rank <= 3) row.className = topClass[rank - 1];

        const rankDisplay = rank <= 3
            ? `<span style="font-size:1.1rem;">${rankEmoji[rank-1]}</span>`
            : `<span style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:0.8rem;color:#94a3b8;">${rank}</span>`;

        const scoreColor = res.score >= 8 ? '#16a34a' : res.score >= 5 ? '#2563eb' : '#dc2626';

        row.innerHTML = `
            <td style="text-align:center;">${rankDisplay}</td>
            <td>
                <div style="font-weight:700;color:#1e293b;font-size:0.9rem;">${res.name}</div>
            </td>
            <td>
                <span style="background:#eff6ff;color:#2563eb;font-size:0.65rem;font-weight:800;padding:0.2rem 0.6rem;border-radius:999px;text-transform:uppercase;">
                    ${res.class}
                </span>
            </td>
            <td style="text-align:center;">
                <span style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1rem;color:${scoreColor};">
                    ${res.score.toFixed(2)}
                </span>
            </td>
            <td style="text-align:right;font-size:0.72rem;color:#94a3b8;font-weight:600;">
                ${new Date(res.timestamp).toLocaleDateString('vi-VN')}<br>
                <span style="font-size:0.65rem;">${new Date(res.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
            </td>
        `;
        body.appendChild(row);
    });
}
window.showLeaderboard = showLeaderboard;

function updateNavButtons() {
    // Legacy function - hidden in continuous scroll layout
}

// --- Statistics & Submission ---
async function submitQuiz() {
    clearInterval(currentState.timerInterval);
    
    let scoreP1 = 0;
    let scoreP2 = 0;
    let scoreP3 = 0;

    QUIZ_DATA.part1.forEach(q => { if (currentState.answers.part1[q.id] === q.answer) scoreP1 += 0.25; });
    
    QUIZ_DATA.part2.forEach(q => {
        let count = 0;
        q.subQuestions.forEach((sq, i) => { if (currentState.answers.part2[q.id] && currentState.answers.part2[q.id][i] === sq.answer) count++; });
        if (count === 1) scoreP2 += 0.1; 
        else if (count === 2) scoreP2 += 0.25; 
        else if (count === 3) scoreP2 += 0.5; 
        else if (count === 4) scoreP2 += 1.0;
    });

    QUIZ_DATA.part3.forEach(q => {
        const studentAns = (currentState.answers.part3[q.id] || '').toString().trim().replace(',', '.');
        const correctAns = q.answer.toString().trim().replace(',', '.');
        if (studentAns && !isNaN(studentAns) && parseFloat(studentAns) === parseFloat(correctAns)) scoreP3 += 0.25;
    });

    const final = Math.round((scoreP1 + scoreP2 + scoreP3) * 100) / 100;
    
    // Update Result UI
    document.getElementById('final-score').textContent = final.toFixed(2);
    document.getElementById('final-feedback').textContent = final >= 8 ? "XUẤT SẮC" : final >= 5 ? "ĐẠT YÊU CẦU" : "CẦN CỐ GẮNG";
    
    const resultObj = { 
        name: currentState.user.data.name, 
        class: currentState.user.data.class, 
        score: final, 
        score_p1: scoreP1,
        score_p2: scoreP2,
        score_p3: scoreP3,
        violations: currentState.violations, 
        timestamp: new Date().toISOString() 
    };

    // 1. Always save to LocalStorage (Fallback)
    const localHistory = JSON.parse(localStorage.getItem('quiz_local_results') || '[]');
    localHistory.push(resultObj);
    localStorage.setItem('quiz_local_results', JSON.stringify(localHistory));

    // 2. Try saving to Supabase
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient.from('quiz_results').insert([resultObj]);
            if (error) {
                console.error("LỗI Supabase:", error);
                alert("Lưu điểm lên Máy chủ thất bại! (Bản lưu gốc vẫn được giữ trên máy này). LỗI: " + error.message);
            } else {
                console.log("Nộp bài thành công!");
            }
        } catch (err) {
            console.error("Lỗi hệ thống:", err);
            alert("Đã xảy ra lỗi khi nộp bài. Tuy nhiên điểm của bạn đã được lưu tạm trên máy này.");
        }
    }
    
    switchView('result');
}

// --- Dashboard Analytics ---
let mainChart = null;

async function initDashboard() {
    switchView('dashboard');
    updateDashboard();
    setInterval(updateDashboard, 15000);
}

window.setDashboardClass = (cls) => {
    dashboardState.activeClass = cls;
    // Update sidebar nav active state
    document.querySelectorAll('.admin-nav-item').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${cls}`).classList.add('active');
    updateDashboard();
};

async function updateDashboard() {
    const rawHistory = await fetchResults();
    const activeClass = dashboardState.activeClass;
    
    // Filter by class
    const history = activeClass === 'all' 
        ? rawHistory 
        : rawHistory.filter(h => h.class === activeClass);

    // Get target population count
    let totalPossible = 0;
    if (activeClass === 'all') {
        totalPossible = STUDENT_DATA["11A1"].length + STUDENT_DATA["11A5"].length;
    } else {
        totalPossible = STUDENT_DATA[activeClass].length;
    }

    document.getElementById('kpi-total').textContent = `${history.length}/${totalPossible}`;
    document.getElementById('kpi-rate').textContent = `${(history.length/totalPossible*100).toFixed(1)}% Hoàn thành`;
    document.getElementById('count-submitted').textContent = history.length;
    
    if (history.length > 0) {
        const scores = history.map(h => h.score);
        document.getElementById('kpi-max').textContent = Math.max(...scores).toFixed(2);
        document.getElementById('kpi-min').textContent = Math.min(...scores).toFixed(2);
        document.getElementById('kpi-avg').textContent = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    } else {
        document.getElementById('kpi-max').textContent = "0.0";
        document.getElementById('kpi-min').textContent = "0.0";
        document.getElementById('kpi-avg').textContent = "0.0";
    }

    renderCharts(history);
    renderHistoryTable(history);
    renderActivityFeed(history);
    renderMissingStudents(rawHistory, activeClass);
}

function renderCharts(history) {
    const dist = Array(11).fill(0);
    history.forEach(h => {
        const idx = Math.min(Math.floor(h.score), 10);
        dist[idx]++;
    });
    
    const ctx1 = document.getElementById('score-chart').getContext('2d');
    if (mainChart) mainChart.destroy();
    mainChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10'],
            datasets: [{ 
                label: 'Số học sinh', 
                data: dist, 
                backgroundColor: 'rgba(37, 99, 235, 0.6)', 
                borderColor: '#2563eb', 
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: { 
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } }
        }
    });
}

function renderHistoryTable(history) {
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = history.length === 0 
        ? '<tr><td colspan="4" class="p-10 text-center text-muted italic">Chưa có bài nộp</td></tr>'
        : '';
        
    [...history].reverse().slice(0, 50).forEach(h => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-5 text-muted font-bold text-xs">${new Date(h.timestamp).toLocaleTimeString('vi-VN')}</td>
            <td class="p-5">
                <div class="font-bold text-navy">${h.name}</div>
                <div class="text-[9px] text-blue-600 font-bold uppercase">${h.class}</div>
            </td>
            <td class="p-5 text-center">
                <span class="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">${(h.score_p1 || 0).toFixed(2)}</span>
            </td>
            <td class="p-5 text-center">
                <span class="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded font-bold">${(h.score_p2 || 0).toFixed(2)}</span>
            </td>
            <td class="p-5 text-center">
                <span class="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded font-bold">${(h.score_p3 || 0).toFixed(2)}</span>
            </td>
            <td class="p-5 text-center">
                <span class="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold font-sci text-[11px] shadow-sm">${(h.score || 0).toFixed(2)}</span>
            </td>
            <td class="p-5 text-center font-bold ${h.violations > 0 ? 'text-red-500' : 'text-slate-300'}">${h.violations}</td>
            <td class="p-5 text-right">
                <button onclick="deleteResultById('${h.id}', '${h.name}')" 
                        class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                        title="Xoá kết quả này">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    lucide.createIcons();
}

function renderActivityFeed(history) {
    const feed = document.getElementById('live-activity');
    feed.innerHTML = '';
    if (history.length === 0) {
        feed.innerHTML = '<div style="padding:1rem;font-size:0.75rem;color:#94a3b8;text-align:center;">Chưa có hoạt động</div>';
        return;
    }
    history.slice(-8).reverse().forEach(h => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.75rem;background:#f8fafc;border-radius:0.6rem;border:1px solid #e2e8f0;';
        item.innerHTML = `
            <div style="width:36px;height:36px;border-radius:0.5rem;background:#1e40af;color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-weight:800;font-size:0.7rem;flex-shrink:0;">${h.score.toFixed(1)}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:0.75rem;font-weight:700;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${h.name}</div>
                <div style="font-size:0.65rem;color:#2563eb;font-weight:700;text-transform:uppercase;">${h.class} &middot; ${new Date(h.timestamp).toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'})}</div>
            </div>
        `;
        feed.appendChild(item);
    });
}

function renderMissingStudents(rawResults, activeClass) {
    const container = document.getElementById('missing-list');
    const submittedNames = new Set(rawResults.map(r => `${r.class}-${r.name}`));
    
    let targetStudents = [];
    if (activeClass === 'all') {
        targetStudents = [...STUDENT_DATA["11A1"].map(s => ({...s, class: "11A1"})), 
                          ...STUDENT_DATA["11A5"].map(s => ({...s, class: "11A5"}))];
    } else {
        targetStudents = STUDENT_DATA[activeClass].map(s => ({...s, class: activeClass}));
    }

    const missing = targetStudents.filter(s => !submittedNames.has(`${s.class}-${s.name}`));
    document.getElementById('count-missing').textContent = missing.length;
    
    container.innerHTML = missing.length === 0 
        ? '<div class="p-4 text-center text-green-600 font-bold text-xs">🎉 Đã hoàn thành 100%</div>' 
        : '';

    missing.forEach(s => {
        const item = document.createElement('div');
        item.className = 'missing-item';
        item.innerHTML = `
            <div>
                <div class="text-[11px] font-bold text-navy">${s.name}</div>
                <div class="text-[8px] text-muted font-bold">${s.class}</div>
            </div>
            <div class="text-[9px] font-bold text-orange-500 uppercase">Chưa làm</div>
        `;
        container.appendChild(item);
    });
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
}

function showAlert(msg) {
    document.getElementById('alert-msg').textContent = msg;
    document.getElementById('alert-modal').classList.remove('hidden');
}
document.getElementById('alert-btn').onclick = () => document.getElementById('alert-modal').classList.add('hidden');
document.getElementById('logout-btn').onclick = () => location.reload();

// --- Administrative Tools ---
async function deleteResultsByClass(cls) {
    if (!supabaseClient) {
        alert("Supabase chưa được kết nối. Không thể xoá dữ liệu.");
        return;
    }

    const confirm1 = confirm(`CẢNH BÁO: Hành động này sẽ xoá TOÀN BỘ dữ liệu bài nộp của lớp ${cls}. Bạn có chắc chắn muốn tiếp tục?`);
    if (!confirm1) return;

    const confirm2 = prompt(`Để xác nhận, vui lòng nhập chính xác tên lớp (${cls}) vào ô bên dưới:`);
    if (confirm2 !== cls) {
        alert("Xác nhận không khớp. Hủy bỏ lệnh xoá.");
        return;
    }

    try {
        const { error, status } = await supabaseClient
            .from('quiz_results')
            .delete()
            .eq('class', cls);

        if (error) {
            console.error("Lỗi Xoá Lớp:", error);
            alert(`Lỗi Server (${error.code}): ${error.message}\n\nHãy kiểm tra xem RLS Policy trên Supabase đã cho phép quyền DELETE cho role 'anon' chưa.`);
        } else if (status === 403 || status === 401) {
             alert("Lỗi 403: Supabase từ chối lệnh Xoá. Bạn cần cấu hình Policy trên bảng 'quiz_results' để cho phép vai trò 'anon' thực hiện quyền DELETE.");
        } else {
            alert(`Đã gửi lệnh xoá thành công cho lớp ${cls}. Nếu dữ liệu vẫn còn, vui lòng kiểm tra lại quyền RLS trên Supabase.`);
            updateDashboard(); // Cập nhật lại giao diện
        }
    } catch (err) {
        console.error("Hệ thống gặp sự cố khi xoá:", err);
        alert("Đã xảy ra sự cố không mong muốn khi thực hiện lệnh xoá.");
    }
}
window.deleteResultsByClass = deleteResultsByClass;

async function deleteResultById(id, name) {
    if (!supabaseClient) {
        alert("Supabase chưa được kết nối. Không thể xoá dữ liệu.");
        return;
    }

    const confirmed = confirm(`Bạn có chắc chắn muốn xoá VĨNH VIỄN kết quả của học sinh "${name}"? Thao tác này sẽ xoá trực tiếp trên Máy chủ (Supabase) và không thể hoàn tác.`);
    if (!confirmed) return;

    try {
        const { error, status } = await supabaseClient
            .from('quiz_results')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Lỗi Xoá Cá Nhân:", error);
            alert(`Lỗi Server (${error.code}): ${error.message}\n\nHãy kiểm tra lại quyền DELETE trong RLS Policy của Supabase.`);
        } else if (status === 403 || status === 401) {
            alert("Lỗi 403: Lệnh xoá bị từ chối bởi Supabase. Bạn cần cấp quyền DELETE cho table 'quiz_results' đối với role 'anon'.");
        } else {
            alert(`Đã gửi lệnh xoá thành công cho "${name}".`);
            updateDashboard(); // Refresh current view
        }
    } catch (err) {
        console.error("Hệ thống gặp sự cố khi xoá cá nhân:", err);
        alert("Đã xảy ra sự cố không mong muốn khi thực hiện lệnh xoá.");
    }
}
window.deleteResultById = deleteResultById;
