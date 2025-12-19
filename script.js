const stage = document.getElementById("stage");
const subtitle = document.getElementById("subtitle");
const message = document.getElementById("message");


let triesLeft = 3;
let canPick = false;


// X positions across stage (VERY far apart)
const X = [0, 195, 390, 585, 780];


// Gift objects track REAL positions
let gifts = [];


function createGifts() {
stage.innerHTML = "";
gifts = [];


for (let i = 0; i < 5; i++) {
const el = document.createElement('div');
el.className = 'gift';
el.textContent = '🎁';
el.dataset.index = i;


el.style.transform = `translate(${X[i]}px, 0px)`;


const gift = {
el,
correct: i === 2, // middle starts correct
pos: i
};


el.onclick = () => pick(gift);


gifts.push(gift);
stage.appendChild(el);
}
}


function showCorrect() {
const g = gifts.find(g => g.correct);
g.el.textContent = '📜';
g.el.classList.add('correct');
}


function hideCorrect() {
gifts.forEach(g => {
g.el.textContent = '🎁';
g.el.classList.remove('correct');
});
}


// Swap two gifts WITH ANIMATION
function swap(a, b) {
const posA = a.pos;
const posB = b.pos;


a.pos = posB;
b.pos = posA;


a.el.style.transform = `translate(${X[a.pos]}px, 0px)`;
b.el.style.transform = `translate(${X[b.pos]}px, 0px)`;
}


async function shuffle(rounds = 8) {
subtitle.textContent = 'Track the gift 👀';


for (let i = 0; i < rounds; i++) {
await wait(900);


const a = gifts[Math.floor(Math.random() * gifts.length)];
let b;
do {
b = gifts[Math.floor(Math.random() * gifts.length)];
} while (a === b);


swap(a, b);
}


canPick = true;
subtitle.textContent = 'Which gift was it? 🎁';
}


function pick(gift) {
if (!canPick) return;


if (gift.correct) {
gift.el.textContent = '📜';
message.textContent = '🎉 YOU TRACKED IT!';
setTimeout(() => location.href = 'letter.html', 1500);
} else {
triesLeft--;
gift.el.textContent = '❌';


if (triesLeft > 0) {
canPick = false;
message.textContent = `Wrong 😭 ${triesLeft} tries left`;
setTimeout(startRound, 1800);
} else {
message.innerHTML = '🔥 The letter is burned forever';
gifts.forEach(g => g.el.textContent = '🔥');
}
}
}


function wait(ms) {
return new Promise(res => setTimeout(res, ms));
}


async function startRound() {
message.textContent = '';
canPick = false;


showCorrect();
await wait(1800);


hideCorrect();
await wait(600);


shuffle();
}


createGifts();
startRound();