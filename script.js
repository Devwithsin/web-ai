// ===== รายการภาพ =====
const images = [
  "img/bird-9811729_1280.jpg",
  "img/collared-macaw-9750855_1280.jpg",
  "img/gioc-village-waterfall-5689446_1280.jpg",
  "img/landscape-9772229_1280.jpg",
  "img/mountain-9726891_1280.jpg",
  "img/norway-9803687_1280.jpg",
  "img/river-8279466_1280.jpg",
  "img/roses-7133951_1280.jpg",
  "img/waterfall-3723422_1280.jpg",
  "img/waterfall-9684883_1280.jpg"
];

// ===== ตัวแปรหลัก =====
let currentIndex = 0;
let currentPrice = 100;
let currentLeader = "ไม่มีใคร";
let timeLeft = 15;
let timer;
let botTimer;
let botMaxBid = getRandomBotLimit();
const bots = ["🤖 Bot A", "🤖 Bot B", "🤖 Bot C"];

// ===== เครดิตผู้ใช้ =====
let userCredit = parseInt(localStorage.getItem("userCredit")) || 3000; // เริ่มต้น 3000
document.getElementById("credit").textContent = userCredit;

// ===== ดึง element =====
const artImg = document.getElementById("artImg");
const priceDisplay = document.getElementById("price");
const leaderDisplay = document.getElementById("leader");
const timerDisplay = document.getElementById("timer");
const winnerDisplay = document.getElementById("winner");
const nameInput = document.getElementById("nameInput");
const bidBtn = document.getElementById("bidBtn");

// ===== เริ่มต้นเมื่อเปิดหน้า =====
artImg.src = images[currentIndex];
startAuction();

function startAuction() {
  console.log(`🎯 บอทจะหยุดที่ไม่เกิน ${botMaxBid} บาทสำหรับภาพนี้`);
  startTimer();
  startBotBidding();
}

// ===== ระบบจับเวลา =====
function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerDisplay.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 3) clearInterval(botTimer);
    if (timeLeft <= 0) {
      clearInterval(timer);
      clearInterval(botTimer);
      endAuction(currentLeader, currentPrice);
    }
  }, 1000);
}

// ===== เสนอราคาผู้เล่น =====
bidBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) return alert("⚠️ กรุณาใส่ชื่อก่อนเสนอราคา!");

  if (userCredit < 100) {
    alert("💸 เครดิตไม่พอสำหรับประมูล!");
    return;
  }

  currentPrice += 100;
  currentLeader = name;
  priceDisplay.textContent = currentPrice;
  leaderDisplay.textContent = currentLeader;
  timeLeft = Math.min(timeLeft + 2, 15);

  if (currentPrice >= botMaxBid) {
    clearInterval(timer);
    clearInterval(botTimer);
    endAuction(currentLeader, currentPrice);
  }
});

// ===== บอทเสนอราคาแบบสุ่ม =====
function startBotBidding() {
  clearInterval(botTimer);
  botTimer = setInterval(() => {
    if (Math.random() < 0.5 && timeLeft > 4) {
      if (currentPrice >= botMaxBid - 100) return;

      const botName = bots[Math.floor(Math.random() * bots.length)];
      const raise = Math.random() < 0.5 ? 100 : 200;
      const newPrice = currentPrice + raise;

      if (newPrice > botMaxBid) return;

      currentPrice = newPrice;
      currentLeader = botName;
      priceDisplay.textContent = currentPrice;
      leaderDisplay.textContent = currentLeader;
      console.log(`${botName} เสนอราคาเพิ่ม ${raise} บาท (รวม ${currentPrice})`);
    }
  }, Math.floor(Math.random() * 2000) + 1500);
}

// ===== จบประมูล =====
function endAuction(winnerName, finalPrice) {
  winnerDisplay.textContent = `🎉 ผู้ชนะคือ ${winnerName} ด้วยราคา ${finalPrice} บาท!`;

  if (!winnerName.startsWith("🤖") && winnerName !== "ไม่มีใคร") {
    if (userCredit >= finalPrice) {
      userCredit -= finalPrice;
      localStorage.setItem("userCredit", userCredit);
      document.getElementById("credit").textContent = userCredit;
      alert(`💰 หักเครดิต ${finalPrice} บาท! เครดิตคงเหลือ: ${userCredit} บาท`);
    } else {
      alert("❌ เครดิตไม่พอสำหรับชำระราคา แต่ระบบถือว่าคุณสละสิทธิ์ 😅");
    }

    // บันทึกลงอัลบั้ม
    const album = JSON.parse(localStorage.getItem("auctionAlbum")) || [];
    album.push({
      winner: winnerName,
      price: finalPrice,
      image: images[currentIndex]
    });
    localStorage.setItem("auctionAlbum", JSON.stringify(album));
  }

  // เปลี่ยนภาพใหม่
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % images.length;
    artImg.src = images[currentIndex];
    currentPrice = 100;
    currentLeader = "ไม่มีใคร";
    priceDisplay.textContent = currentPrice;
    leaderDisplay.textContent = currentLeader;
    winnerDisplay.textContent = "";
    botMaxBid = getRandomBotLimit();
    startAuction();
  }, 3000);
}

// ===== สุ่มเพดานบอทแต่ละภาพ (400–700) =====
function getRandomBotLimit() {
  return Math.floor(Math.random() * 300) + 400;
}
