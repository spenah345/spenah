const schedule = {
  Monday: [
    { time: "08:00", activity: "Work 🤾‍♀️" },
    { time: "16:00", activity: "Rest 😔" },
    { time: "19:00", activity: "Gaming 🎮" },
    { time: "00:00", activity: "Sleep 💤" }
  ],
  Tuesday: [
    { time: "08:00", activity: "Work 🤾‍♀️" },
    { time: "16:00", activity: "Rest 😔" },
    { time: "19:00", activity: "Gaming 🎮" },
    { time: "00:00", activity: "Sleep 💤" }
  ],
  Wednesday: [
    { time: "08:00", activity: "Work 🤾‍♀️" },
    { time: "16:00", activity: "Rest 😔" },
    { time: "19:00", activity: "Gaming 🎮" },
    { time: "00:00", activity: "Sleep 💤" }
  ],
  Thursday: [
    { time: "08:00", activity: "Work 🤾‍♀️" },
    { time: "16:00", activity: "Rest 😔" },
    { time: "19:00", activity: "Gaming 🎮" },
    { time: "00:00", activity: "Sleep 💤" }
  ],
  Friday: [
    { time: "08:00", activity: "Work 🤾‍♀️" },
    { time: "16:00", activity: "Rest 😔" },
    { time: "19:00", activity: "Gaming 🎮" },
    { time: "00:00", activity: "Sleep 💤" }
  ],
  Saturday: [
    { time: "08:00", activity: "Work 🤾‍♀️" },
    { time: "16:00", activity: "Rest 😔" },
    { time: "19:00", activity: "Gaming 🎮" },
    { time: "00:00", activity: "Sleep 💤" }
  ],
  Sunday: [
    { time: "08:00", activity: "Work 🤾‍♀️" },
    { time: "16:00", activity: "Rest 😔" },
    { time: "19:00", activity: "Gaming 🎮" },
    { time: "00:00", activity: "Sleep 💤" }
  ]
};

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  document.getElementById("clock").textContent = timeStr;
  updateActivity(now);
}

function updateActivity(now) {
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedule = getSchedule()[day] || [];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let current = todaySchedule[0];

  for (let i = 0; i < todaySchedule.length; i++) {
    const nextTime = parseTime(todaySchedule[i].time);
    const nextMinutes = nextTime.hours * 60 + nextTime.minutes;
    if (currentMinutes >= nextMinutes) {
      current = todaySchedule[i];
    }
  }

  document.getElementById("current-activity").textContent = `Now: ${current.activity}`;

  updateProgress(todaySchedule, currentMinutes);
}

function updateProgress(scheduleList, currentMinutes) {
  let start = 0, end = 1440;
  for (let i = 0; i < scheduleList.length; i++) {
    const time = parseTime(scheduleList[i].time);
    const minutes = time.hours * 60 + time.minutes;
    if (currentMinutes >= minutes) {
      start = minutes;
      end = i + 1 < scheduleList.length
        ? parseTime(scheduleList[i + 1].time).hours * 60 + parseTime(scheduleList[i + 1].time).minutes
        : 1440;
    }
  }
  const progress = ((currentMinutes - start) / (end - start)) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
}

function loadSchedule() {
  const custom = localStorage.getItem("spenah-schedule");
  return custom ? JSON.parse(custom) : schedule;
}

function getSchedule() {
  return loadSchedule();
}

function displaySchedule() {
  const tbody = document.getElementById("schedule-body");
  tbody.innerHTML = "";
  const sched = getSchedule();
  Object.entries(sched).forEach(([day, items]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${day}</td><td>${items.map(i => `${i.time} - ${i.activity}`).join("<br>")}</td>`;
    tbody.appendChild(row);
  });
}

function showEditor() {
  document.getElementById("editor").classList.remove("hidden");
}

function unlockEdit() {
  const pass = document.getElementById("password").value;
  if (pass === "12345spenah") {
    document.getElementById("edit-area").classList.remove("hidden");
    document.getElementById("schedule-input").value = JSON.stringify(getSchedule(), null, 2);
  } else {
    alert("Wrong password");
  }
}

function saveSchedule() {
  try {
    const value = document.getElementById("schedule-input").value;
    const parsed = JSON.parse(value);
    localStorage.setItem("spenah-schedule", JSON.stringify(parsed));
    displaySchedule();
    alert("Schedule saved!");
  } catch (e) {
    alert("Invalid JSON");
  }
}

function sendMessage() {
  const input = document.getElementById("chat-message");
  const box = document.getElementById("chat-box");
  const msg = input.value.trim();
  if (!msg) return;
  box.innerHTML += `<div class="user-msg">You: ${msg}</div>`;
  input.value = "";

  setTimeout(() => {
    const reply = getAIResponse(msg);
    box.innerHTML += `<div class="ai-msg">Spenah: ${reply}</div>`;
    box.scrollTop = box.scrollHeight;
  }, 500);
}

function getAIResponse(msg) {
  const responses = [
    "Hehe~ iyaaa~",
    "Kamu lucu banget tau~",
    "Nggak boleh gitu dong~",
    "Spenah capee deeh~",
    "Hayo kamu lagi godain aku ya~",
    "Aku lagi sibuk kerja nih~",
    "Main gamenya bareng yuk~",
    "Zzz... ngantuk...",
    "Mau teh anget ga?",
    "Hari ini cerah ya!"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

setInterval(updateClock, 1000);
window.onload = () => {
  displaySchedule();
  updateClock();
  requestNotificationPermissions();
};

function requestNotificationPermissions() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        const alerts = [
          { hour: 8, title: "Spenah mulai kerja", body: "Jam 08:00 - 16:00 dia sedang bekerja" },
          { hour: 16, title: "Spenah istirahat", body: "Jam 16:00 - 19:00 dia sedang istirahat" },
          { hour: 19, title: "Spenah main game!", body: "Jam 19:00 - 00:00 dia gaming!" },
          { hour: 0, title: "Spenah tidur zzz", body: "Jam 00:00 - 08:00 dia tidur" }
        ];
        alerts.forEach(alert => scheduleNotification(alert.title, alert.body, alert.hour));
      }
    });
  }
}

function scheduleNotification(title, body, hour) {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, 0, 0, 0);
  if (target < now) target.setDate(target.getDate() + 1);

  const timeout = target - now;
  setTimeout(() => {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, {
        body,
        icon: "icons/icon-192.png"
      });
    });
  }, timeout);
}
