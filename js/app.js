// ==================== Stars Background ====================
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

// ==================== Score System ====================
let totalScore = parseInt(localStorage.getItem('aiKidScore') || '0');

function updateScoreDisplay() {
    const scoreText = document.getElementById('totalScore');
    if (scoreText) {
        scoreText.textContent = totalScore + ' คะแนน';
    }
}

function addScore(points) {
    totalScore += points;
    localStorage.setItem('aiKidScore', totalScore);
    updateScoreDisplay();
    
    if (points > 0) {
        showConfetti();
    }
}

function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
    
    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(piece);
    }
    
    setTimeout(() => {
        confettiContainer.remove();
    }, 3000);
}

// ==================== Quiz System ====================
const quizData = [
    {
        question: 'AI ย่อมาจากอะไร?',
        options: ['Automatic Internet', 'Artificial Intelligence', 'Amazing Ideas', 'All In One'],
        correct: 1
    },
    {
        question: 'AI ตัวไหนที่ช่วยเราคุยได้?',
        options: ['Excel', 'Siri', 'Word', 'Paint'],
        correct: 1
    },
    {
        question: 'AI สามารถทำอะไรได้?',
        options: ['วาดรูป', 'ตอบคำถาม', 'เล่นเกม', 'ถูกทุกข้อ'],
        correct: 3
    },
    {
        question: 'เราควรบอกข้อมูลอะไรให้ AI บ้าง?',
        options: ['รหัสผ่าน', 'ที่อยู่บ้าน', 'ข้อมูลส่วนตัว', 'ไม่ควรบอกข้อมูลสำคัญ'],
        correct: 3
    },
    {
        question: 'YouTube ใช้ AI ทำอะไร?',
        options: ['แนะนำวิดีโอ', 'ลบวิดีโอ', 'สร้างวิดีโอ', 'ขายวิดีโอ'],
        correct: 0
    },
    {
        question: 'AI เรียนรู้จากอะไร?',
        options: ['ไฟฟ้า', 'ข้อมูล', 'อินเทอร์เน็ต', 'แบตเตอรี่'],
        correct: 1
    },
    {
        question: 'รถยนต์ขับเองใช้เทคโนโลยีอะไร?',
        options: ['AI', 'GPS อย่างเดียว', 'วิทยุ', 'ทีวี'],
        correct: 0
    },
    {
        question: 'Face ID ใช้ AI ทำอะไร?',
        options: ['ถ่ายรูป', 'จดจำใบหน้า', 'ฟังเพลง', 'เล่นเกม'],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let answered = 0;

function loadQuestion() {
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const progressEl = document.getElementById('progress');
    const scoreDisplayEl = document.getElementById('score-display');
    
    if (!questionEl || !optionsEl) return;
    
    const q = quizData[currentQuestion];
    questionEl.textContent = `คำถามที่ ${currentQuestion + 1}: ${q.question}`;
    
    // สุ่มตำแหน่งคำตอบ
    const shuffledOptions = q.options.map((opt, index) => ({
        text: opt,
        isCorrect: index === q.correct
    }));
    
    // Fisher-Yates shuffle
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    optionsEl.innerHTML = '';
    
    shuffledOptions.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.textContent = opt.text;
        btn.onclick = () => checkAnswer(opt.isCorrect, btn, shuffledOptions);
        optionsEl.appendChild(btn);
    });
    
    if (progressEl) {
        progressEl.style.width = ((currentQuestion / quizData.length) * 100) + '%';
        progressEl.textContent = Math.round((currentQuestion / quizData.length) * 100) + '%';
    }
    
    if (scoreDisplayEl) {
        scoreDisplayEl.textContent = `คะแนน: ${score} / ${answered}`;
    }
}

function checkAnswer(isCorrect, btn, allOptions) {
    const buttons = document.querySelectorAll('.quiz-btn');
    
    buttons.forEach(b => b.style.pointerEvents = 'none');
    
    if (isCorrect) {
        btn.classList.add('correct');
        score++;
        addScore(10);
    } else {
        btn.classList.add('wrong');
        // เฉลยคำตอบที่ถูก
        buttons.forEach((b, index) => {
            if (allOptions[index].isCorrect) {
                b.classList.add('correct');
            }
        });
    }
    
    answered++;
    
    const scoreDisplayEl = document.getElementById('score-display');
    if (scoreDisplayEl) {
        scoreDisplayEl.textContent = `คะแนน: ${score} / ${answered}`;
    }
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showQuizResult();
        }
    }, 1500);
}

function showQuizResult() {
    const quizEl = document.getElementById('quiz');
    if (!quizEl) return;
    
    const percentage = (score / quizData.length) * 100;
    let message = '';
    let emoji = '';
    
     if (percentage >= 80) {
         message = 'ยอดเยี่ยมมาก!';
         emoji = '🌟';
     } else if (percentage >= 60) {
         message = 'ดีมาก!';
         emoji = '😊';
     } else {
         message = 'พยายามดีมาก!';
         emoji = '💪';
    }
    
    quizEl.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="font-size: 4em; margin-bottom: 20px;">${emoji}</div>
            <h3 style="font-size: 1.5em; color: #333;">${message}</h3>
            <p style="font-size: 1.3em; color: #666;">น้องๆ ทำได้ดีมาก!</p>
            <p style="font-size: 2em; color: #764ba2; margin: 20px 0;">คะแนน: ${score} / ${quizData.length}</p>
            <button class="game-btn" onclick="restartQuiz()">🔄 เล่นอีก!</button>
        </div>
    `;
    
    if (percentage >= 80) {
        const achievementEl = document.getElementById('quizAchievement');
        if (achievementEl) {
            achievementEl.style.display = 'flex';
        }
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = 0;
    
    const quizEl = document.getElementById('quiz');
    if (!quizEl) return;
    
    quizEl.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" id="progress" style="width: 0%">0%</div>
        </div>
        <div class="quiz-question" id="question"></div>
        <div class="quiz-options" id="options"></div>
        <div class="score" id="score-display">คะแนน: 0 / 0</div>
    `;
    
    const achievementEl = document.getElementById('quizAchievement');
    if (achievementEl) {
        achievementEl.style.display = 'none';
    }
    
    loadQuestion();
}

// ==================== Emoji Game ====================
const emojis = ['🍎', '🐱', '🌟', '🚗', '🎸', '🌈', '🍕', '🦋', '🎈', '🐶', '🌺', '⚽', '🎂', '🦄', '🍦'];
const emojiNames = {
    '🍎': 'แอปเปิ้ล',
    '🐱': 'แมว',
    '🌟': 'ดาว',
    '🚗': 'รถยนต์',
    '🎸': 'กีตาร์',
    '🌈': 'รุ้ง',
    '🍕': 'พิซซ่า',
    '🦋': 'ผีเสื้อ',
    '🎈': 'ลูกโป่ง',
    '🐶': 'หมา',
    '🌺': 'ดอกไม้',
    '⚽': 'ฟุตบอล',
    '🎂': 'เค้ก',
    '🦄': 'ยูนิคอร์น',
    '🍦': 'ไอศกรีม'
};

let currentEmoji = '🍎';
let aiCorrect = 0;

function playGame() {
    currentEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const emojiEl = document.getElementById('game-emoji');
    const resultEl = document.getElementById('game-result');
    
    if (emojiEl) emojiEl.textContent = currentEmoji;
    if (resultEl) resultEl.textContent = '';
}

function aiGuess() {
    const guess = emojiNames[currentEmoji];
    const random = Math.random();
    const resultEl = document.getElementById('game-result');
    const scoreEl = document.getElementById('game-score');
    
    if (!resultEl) return;
    
    if (random > 0.3) {
        resultEl.innerHTML = `<span style="color: #22c55e;">✅ AI ทายว่า: ${guess} (ถูก!)</span>`;
        aiCorrect++;
        addScore(5);
        
        if (aiCorrect >= 5) {
            const achievementEl = document.getElementById('gameAchievement');
            if (achievementEl) {
                achievementEl.style.display = 'flex';
            }
        }
    } else {
        const wrongAnswers = Object.values(emojiNames).filter(n => n !== guess);
        const wrongGuess = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        resultEl.innerHTML = `<span style="color: #ef4444;">❌ AI ทายว่า: ${wrongGuess} (ผิด! คำตอบคือ ${guess})</span>`;
    }
    
    if (scoreEl) {
        scoreEl.textContent = `AI ทายถูก: ${aiCorrect} ครั้ง`;
    }
}

// ==================== Capability Details Modal ====================
const capabilityDetails = {
     talk: {
         title: '💬 AI คุยกับเรา',
        content: `
            <h3 style="color: #333; margin-bottom: 15px;">AI สามารถคุยกับเราได้อย่างไร?</h3>
            <p style="color: #666; line-height: 1.8; margin-bottom: 20px;">
                AI ที่สามารถคุยกับเราได้ เช่น <strong>Siri</strong>, <strong>Google Assistant</strong>, <strong>Alexa</strong> ทำงานโดยการ:
            </p>
            <div class="step-container">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>ฟังเสียงเรา</h3>
                        <p>AI ใช้ไมโครโฟนฟังเสียงที่เราพูด</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>แปลงเสียงเป็นข้อความ</h3>
                        <p>AI แปลงเสียงพูดของเราเป็นข้อความที่คอมพิวเตอร์เข้าใจ</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>คิดหาคำตอบ</h3>
                        <p>AI ค้นหาข้อมูลและคิดหาคำตอบที่เหมาะสม</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h3>ตอบกลับเรา</h3>
                        <p>AI แปลงคำตอบกลับเป็นเสียงพูดให้เราฟัง</p>
                    </div>
                </div>
            </div>
        `
    },
    draw: {
        title: '🎨 AI วาดรูป',
        content: `
            <h3 style="color: #333; margin-bottom: 15px;">AI วาดรูปได้อย่างไร?</h3>
            <p style="color: #666; line-height: 1.8; margin-bottom: 20px;">
                AI ที่วาดรูปได้ เช่น <strong>DALL-E</strong>, <strong>Midjourney</strong>, <strong>Stable Diffusion</strong> ทำงานโดย:
            </p>
            <div class="step-container">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>อ่านข้อความ</h3>
                        <p>AI อ่านข้อความที่เราพิมพ์อธิบายรูปภาพที่ต้องการ</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>นึกภาพในใจ</h3>
                        <p>AI นึกภาพจากข้อความที่เคยเรียนรู้มา</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>วาดรูปทีละนิด</h3>
                        <p>AI เริ่มจากจุดเล็กๆ แล้วค่อยๆ เติมรายละเอียด</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h3>เสร็จสมบูรณ์</h3>
                        <p>AI เสร็จรูปสวยๆ ให้เรา!</p>
                    </div>
                </div>
            </div>
        `
    },
    game: {
        title: '🎮 AI เล่นเกม',
        content: `
            <h3 style="color: #333; margin-bottom: 15px;">AI เล่นเกมเก่งขนาดไหน?</h3>
            <p style="color: #666; line-height: 1.8; margin-bottom: 20px;">
                AI สามารถเล่นเกมได้หลายประเภท และบางเกม AI เล่นเก่งกว่ามนุษย์!
            </p>
            <div class="step-container">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>เรียนรู้กฎ</h3>
                        <p>AI เรียนรู้กฎและวิธีการเล่นของเกม</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>ฝึกเล่น</h3>
                        <p>AI ฝึกเล่นเกมหลายล้านครั้งเพื่อหาวิธีที่ดีที่สุด</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>คิดกลยุทธ์</h3>
                        <p>AI คิดหาวิธีการเล่นที่ดีที่สุด</p>
                    </div>
                </div>
            </div>
            <div class="fun-fact">
                <p>🌟 <strong>รู้หรือไม่?</strong> AI ชื่อ AlphaGo ชนะแชมป์โลกเกมโกะ ซึ่งเป็นเกมที่ยากมาก!</p>
            </div>
        `
    },
     learn: {
         title: '📚 AI ช่วยเรียน',
        content: `
            <h3 style="color: #333; margin-bottom: 15px;">AI ช่วยเราเรียนได้อย่างไร?</h3>
            <p style="color: #666; line-height: 1.8; margin-bottom: 20px;">
                AI สามารถช่วยเราเรียนในหลายวิธี:
            </p>
             <div class="cards">
                 <div class="card">
                     <div class="emoji">❓</div>
                     <h3>ตอบคำถาม</h3>
                     <p>AI สามารถตอบคำถามที่เราสงสัยได้ทันที</p>
                 </div>
                 <div class="card">
                     <div class="emoji">💡</div>
                     <h3>อธิบายเรื่องยาก</h3>
                     <p>AI อธิบายเรื่องยากๆ ให้เข้าใจง่ายๆ</p>
                 </div>
                 <div class="card">
                     <div class="emoji">✏️</div>
                     <h3>ช่วยทำการบ้าน</h3>
                     <p>AI ช่วยเราเข้าใจการบ้าน แต่ไม่ใช่ทำให้เรา!</p>
                 </div>
             </div>
            <div class="fun-fact">
                <p>🌟 <strong>คำแนะนำ:</strong> ใช้ AI เป็นตัวช่วยในการเรียน แต่ต้องคิดและทำความเข้าใจเองด้วย!</p>
            </div>
        `
    },
    drive: {
        title: '🚗 AI ขับรถ',
        content: `
            <h3 style="color: #333; margin-bottom: 15px;">รถยนต์ขับเองได้อย่างไร?</h3>
            <p style="color: #666; line-height: 1.8; margin-bottom: 20px;">
                รถยนต์ที่ขับเองได้ใช้ AI หลายอย่างร่วมกัน:
            </p>
            <div class="step-container">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>เห็นถนน</h3>
                        <p>AI ใช้กล้องและเซ็นเซอร์เห็นถนน รถคันอื่น และคนเดินถนน</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>คิดตัดสินใจ</h3>
                        <p>AI คิดว่าควรขับอย่างไร ปลอดภัยที่สุด</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>ควบคุมรถ</h3>
                        <p>AI ควบคุมพวงมาลัย เบรก และคันเร่ง</p>
                    </div>
                </div>
            </div>
            <div class="fun-fact">
                <p>🌟 <strong>รู้หรือไม่?</strong> Tesla เป็นบริษัทที่ผลิตรถยนต์ขับเองได้ที่มีชื่อเสียงมาก!</p>
            </div>
        `
    },
    doctor: {
        title: '🏥 AI ช่วยหมอ',
        content: `
            <h3 style="color: #333; margin-bottom: 15px;">AI ช่วยหมอได้อย่างไร?</h3>
            <p style="color: #666; line-height: 1.8; margin-bottom: 20px;">
                AI ช่วยหมอในหลายด้าน:
            </p>
             <div class="cards">
                 <div class="card">
                     <div class="emoji">🔍</div>
                     <h3>ตรวจโรค</h3>
                     <p>AI ช่วยตรวจหาโรคจากรูปถ่ายหรือผลตรวจ</p>
                 </div>
                 <div class="card">
                     <div class="emoji">💊</div>
                     <h3>แนะนำยา</h3>
                     <p>AI ช่วยหมอเลือกยาที่เหมาะสมกับคนไข้</p>
                 </div>
                 <div class="card">
                     <div class="emoji">📊</div>
                     <h3>วิเคราะห์ข้อมูล</h3>
                     <p>AI วิเคราะห์ข้อมูลคนไข้จำนวนมากเพื่อหาความผิดปกติ</p>
                 </div>
            </div>
            <div class="fun-fact">
                <p>🌟 <strong>สำคัญ:</strong> AI เป็นแค่ตัวช่วยหมอ หมอยังต้องตัดสินใจสุดท้ายเอง!</p>
            </div>
        `
    }
};

function showCapabilityDetail(type) {
    const detail = capabilityDetails[type];
    if (!detail) return;
    
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('capabilityModal');
    
    if (modalBody) {
        modalBody.innerHTML = `
            <h2 style="color: #764ba2; margin-bottom: 20px;">${detail.title}</h2>
            ${detail.content}
        `;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('capabilityModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ==================== AI Tools Click Tracking ====================
function initChat() {
    // Removed - now using AI tools links instead
}

function connectToAI() {
    // Removed - now using AI tools links instead
}

function addMessage(text, isUser) {
    // Removed - now using AI tools links instead
}

function addLoadingMessage() {
    // Removed - now using AI tools links instead
}

function removeLoadingMessage() {
    // Removed - now using AI tools links instead
}

async function callGeminiAPI(message) {
    // Removed - now using AI tools links instead
}

async function sendChat() {
    // Removed - now using AI tools links instead
}

async function sendQuickQuestion(question) {
    // Removed - now using AI tools links instead
}

// ==================== AI Recommend Demo ====================
function aiRecommendDemo() {
    const input = document.getElementById('recommendInput');
    const output = document.getElementById('recommendOutput');
    
    if (!input || !output) return;
    
    const inputValue = input.value.trim();
    if (!inputValue) {
        output.innerHTML = '<p style="color: #ef4444;">กรุณาพิมพ์สิ่งที่ชอบก่อนนะ!</p>';
        return;
    }
    
    output.innerHTML = '<p style="color: #666;"> AI กำลังคิด...</p>';
    
    setTimeout(() => {
        const recommendations = {
            'เพลง': '🎵 แนะนำ: เพลง "Shape of You" ของ Ed Sheeran, "Blinding Lights" ของ The Weeknd, "Dynamite" ของ BTS',
            'อาหาร': '🍜 แนะนำ: ข้าวผัด, ผัดไทย, ต้มยำกุ้ง, ส้มตำ, ก๋วยเตี๋ยว',
            'กีฬา': '⚽ แนะนำ: ฟุตบอล, บาสเกตบอล, วอลเลย์บอล, ว่ายน้ำ, แบดมินตัน',
            'default': '✨ เกี่ยวกับ "' + inputValue + '" AI แนะนำให้ลองค้นหาข้อมูลเพิ่มเติมนะ!'
        };
        
        const rec = recommendations[inputValue] || recommendations['default'];
        output.innerHTML = `<p style="color: #22c55e;">${rec}</p>`;
        addScore(2);
    }, 1000);
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    updateScoreDisplay();
    loadQuestion();
    initChat();
    
    // Close modal when clicking outside
    const modal = document.getElementById('capabilityModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});
