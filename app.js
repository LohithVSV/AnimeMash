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
    bgMusic.play();
    const leftChar = document.getElementById('left-char');
    const rightChar = document.getElementById('right-char');
    const authBox = document.getElementById('auth-box');
    const blueBall = document.getElementById('blue-ball');
    const redBall = document.getElementById('red-ball');
    const gojo = document.getElementById('gojo-img');
    const purpleBall = document.getElementById('purple-ball');

    // hide original characters
    leftChar.style.transition = 'opacity 0.3s ease';
    rightChar.style.transition = 'opacity 0.3s ease';
    leftChar.style.opacity = '0';
    rightChar.style.opacity = '0';

    // fade out auth box
    authBox.style.transition = 'opacity 0.5s ease';
    authBox.style.opacity = '0';
    authBox.style.pointerEvents = 'none';

    const ballSize = 220;
    const screenCenterX = window.innerWidth / 2;
    const ballY = 225;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // red ball starts at left (death note position)
    redBall.style.display = 'block';
    redBall.style.position = 'fixed';
    redBall.style.width = ballSize + 'px';
    redBall.style.height = ballSize + 'px';
    redBall.style.borderRadius = '50%';
    redBall.style.objectFit = 'cover';
    redBall.style.left = '0px';
    redBall.style.top = ballY + 'px';
    redBall.style.transition = 'none';
    redBall.style.zIndex = '1000';

    // blue ball starts at right (demon slayer position)
    blueBall.style.display = 'block';
    blueBall.style.position = 'fixed';
    blueBall.style.width = ballSize + 'px';
    blueBall.style.height = ballSize + 'px';
    blueBall.style.borderRadius = '50%';
    blueBall.style.objectFit = 'cover';
    blueBall.style.left = '662px';
    blueBall.style.top = ballY + 'px';
    blueBall.style.transition = 'none';
    blueBall.style.zIndex = '1000';

    // gojo appears immediately when balls appear
    gojo.style.display = 'block';
    gojo.style.position = 'fixed';
    gojo.style.width = '350px';
    gojo.style.left = (centerX - 175) + 'px';
    gojo.style.top = (centerY - 175) + 'px';
    gojo.style.opacity = '0';
    gojo.style.transition = 'opacity 0.6s ease';
    gojo.style.zIndex = '999';
    setTimeout(() => gojo.style.opacity = '1', 50);

    // fly toward each other — tip to tip
    setTimeout(() => {
        redBall.style.transition = 'left 1.3s ease';
        blueBall.style.transition = 'left 1.3s ease';

        redBall.style.left = (screenCenterX - ballSize + 25) + 'px';
        blueBall.style.left = (screenCenterX - 25) + 'px';
    }, 400);

    // collision — hide balls, show purple
    setTimeout(() => {
        redBall.style.display = 'none';
        blueBall.style.display = 'none';

        // purple ball at collision point
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

    }, 1800);
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${username}&password=${password}`
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', username);
        window.location.href = 'home.html';
    } else {
        document.getElementById("errorMsg").textContent = data.detail;
        document.getElementById("errorMsg").style.display = "block";
    }
}

async function register() {
    const username= document.getElementById('reg-username').value;
    const email=document.getElementById("reg-email").value;
    const password = document.getElementById('reg-password').value;

    const response = await fetch('http://localhost:8000/users', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username:username,email: email, password: password})
    })
    if (response.ok) {
        alert('Registration successful! Please log in.');
        toggleForm();
    } else {
        const data = await response.json();
        document.getElementById("regerrorMsg").textContent = data.detail;
        document.getElementById("regerrorMsg").style.display = "block";
    }
};

const currentPage = window.location.pathname;

if (currentPage.includes('home.html')) {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'index.html';

    const username = localStorage.getItem('username');
    document.getElementById('username-display').textContent = username;
}
