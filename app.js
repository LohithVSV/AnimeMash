function toggleForm() {
    const login = document.getElementById('login-form');
    const register = document.getElementById('register-form');

    if (login.style.display === 'none') {
        login.style.display = 'block';
        register.style.display = 'none';
    } else {
        login.style.display = 'none';
        register.style.display = 'block';
    }
}

function startLoginAnimation() {
    const bgMusic = new Audio('assets/theme.mp3');
    bgMusic.currentTime = 13;
    bgMusic.play().catch(() => {});

    const leftChar = document.getElementById('left-char');
    const rightChar = document.getElementById('right-char');
    const authBox = document.getElementById('auth-box');
    const blueBall = document.getElementById('blue-ball');
    const redBall = document.getElementById('red-ball');
    const gojo = document.getElementById('gojo-img');
    const purpleBall = document.getElementById('purple-ball');

    leftChar.style.transition = 'opacity 0.3s ease';
    rightChar.style.transition = 'opacity 0.3s ease';
    leftChar.style.opacity = '0';
    rightChar.style.opacity = '0';

    authBox.style.transition = 'opacity 0.5s ease';
    authBox.style.opacity = '0';
    authBox.style.pointerEvents = 'none';

    const ballSize = 220;
    const screenCenterX = window.innerWidth / 2;
    const ballY = 225;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    redBall.style.display = 'block';
    redBall.style.position = 'fixed';
    redBall.style.width = ballSize + 'px';
    redBall.style.height = ballSize + 'px';
    redBall.style.borderRadius = '50%';
    redBall.style.objectFit = 'cover';
    redBall.style.left = '25px';
    redBall.style.top = ballY + 'px';
    redBall.style.transition = 'none';
    redBall.style.zIndex = '1000';

    blueBall.style.display = 'block';
    blueBall.style.position = 'fixed';
    blueBall.style.width = ballSize + 'px';
    blueBall.style.height = ballSize + 'px';
    blueBall.style.borderRadius = '50%';
    blueBall.style.objectFit = 'cover';
    blueBall.style.left = '990px';
    blueBall.style.top = ballY + 'px';
    blueBall.style.transition = 'none';
    blueBall.style.zIndex = '1000';

    gojo.style.display = 'block';
    gojo.style.position = 'fixed';
    gojo.style.width = '350px';
    gojo.style.left = (centerX - 175) + 'px';
    gojo.style.top = (centerY - 175) + 'px';
    gojo.style.opacity = '0';
    gojo.style.transition = 'opacity 0.6s ease';
    gojo.style.zIndex = '999';
    setTimeout(() => gojo.style.opacity = '1', 50);

    setTimeout(() => {
        redBall.style.transition = 'left 1.3s ease';
        blueBall.style.transition = 'left 1.3s ease';
        redBall.style.left = (screenCenterX - ballSize + 25) + 'px';
        blueBall.style.left = (screenCenterX - 25) + 'px';
    }, 400);

    setTimeout(() => {
        redBall.style.display = 'none';
        blueBall.style.display = 'none';

        purpleBall.style.display = 'block';
        purpleBall.style.position = 'fixed';
        purpleBall.style.width = '225px';
        purpleBall.style.height = '225px';
        purpleBall.style.borderRadius = '100%';
        purpleBall.style.objectFit = 'cover';
        purpleBall.style.left = (centerX - 100) + 'px';
        purpleBall.style.top = (ballY + ballSize / 2 - 100) + 'px';
        purpleBall.style.zIndex = '1000';
        purpleBall.style.opacity = '0';
        purpleBall.style.transition = 'opacity 0.4s ease';
        purpleBall.classList.add('spinning');
        setTimeout(() => purpleBall.style.opacity = '1', 50);

        setTimeout(() => {
            purpleBall.style.transition = 'all 0.6s ease';
            purpleBall.style.width = '300vw';
            purpleBall.style.height = '300vw';
            purpleBall.style.left = (centerX - 150 * window.innerWidth / 100) + 'px';
            purpleBall.style.top = (centerY - 150 * window.innerWidth / 100) + 'px';
            purpleBall.style.borderRadius = '50%';
        }, 800);

        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1600);

    }, 1800);
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('https://animemash-lwty.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${username}&password=${password}`
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', username);
        startLoginAnimation();
    } else {
        document.getElementById("errorMsg").textContent = data.detail;
        document.getElementById("errorMsg").style.display = "block";
    }
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById('reg-password').value;

    const response = await fetch('https://animemash-lwty.onrender.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, email: email, password: password })
    });

    if (response.ok) {
        alert('Registration successful! Please log in.');
        toggleForm();
    } else {
        const data = await response.json();
        document.getElementById("regerrorMsg").textContent = data.detail;
        document.getElementById("regerrorMsg").style.display = "block";
    }
}

const currentPage = window.location.pathname;

if (currentPage.includes('home.html')) {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'index.html';
    const username = localStorage.getItem('username');
    document.getElementById('username-display').textContent = username;
}

let loaderInterval = null;

function showLoader() {
    const loader = document.getElementById('zenitsu-loader');
    const trail = document.getElementById('lightning-trail');
    const zenitsu = document.getElementById('zenitsu-run');
    if (!loader) return;

    loader.style.display = 'block';
    let progress = 0;
    trail.style.width = '0%';
    zenitsu.style.left = '0%';

    // slowly crawl to 65%
    loaderInterval = setInterval(() => {
        if (progress < 65) {
            progress += 0.4;
            trail.style.width = progress + '%';
            zenitsu.style.left = progress + '%';
        }
    }, 30);
}

function hideLoader() {
    const loader = document.getElementById('zenitsu-loader');
    const trail = document.getElementById('lightning-trail');
    const zenitsu = document.getElementById('zenitsu-run');
    if (!loader) return;

    clearInterval(loaderInterval);

    // sprint to 100%
    trail.style.transition = 'width 0.4s ease';
    zenitsu.style.transition = 'left 0.4s ease';
    trail.style.width = '100%';
    zenitsu.style.left = '100%';

    setTimeout(() => {
        loader.style.display = 'none';
        trail.style.width = '0%';
        zenitsu.style.left = '0%';
        trail.style.transition = 'width 0.3s ease';
        zenitsu.style.transition = 'left 0.3s ease';
    }, 450);
}

async function loadBattle() {
    showLoader();
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    const response = await fetch('https://animemash-lwty.onrender.com/battle', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    window.char1Id = data.character1.id;
    window.char2Id = data.character2.id;
    document.getElementById('char1-img').src = data.character1.image_url;
    document.getElementById('char1-name').textContent = data.character1.name;
    document.getElementById('char1-bio').textContent = data.character1.bio;
    document.getElementById('char2-img').src = data.character2.image_url;
    document.getElementById('char2-name').textContent = data.character2.name;
    document.getElementById('char2-bio').textContent = data.character2.bio;
    hideLoader();
}

async function vote(choice) {
    showLoader();
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    const response = await fetch('https://animemash-lwty.onrender.com/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            winner_id: choice === 1 ? window.char1Id : window.char2Id,
            loser_id: choice === 1 ? window.char2Id : window.char1Id
        })
    });
    const data = await response.json();
    if (response.ok) {
        await loadBattle();
    } else {
        hideLoader();
        alert(data.detail);
    }
}

if (window.location.pathname.includes('battle.html')) {
    loadBattle();
}

async function loadLeaderboard() {
    showLoader();
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    const response = await fetch('https://animemash-lwty.onrender.com/leaderboard', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    data.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.character_name}</td>
            <td>${entry.wins}</td>
        `;
        tbody.appendChild(row);
    });
    hideLoader();
}

if (window.location.pathname.includes('leaderboard.html')) {
    loadLeaderboard();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

if (window.location.pathname.includes('profile.html')) {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'index.html';
    document.getElementById('profile-username').textContent = localStorage.getItem('username');
}