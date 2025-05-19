// === Terminal typing effect ===
const terminalTextEl = document.getElementById('terminal-text');
const cursorEl = document.querySelector('.cursor');

const lines = [
  '$ id -u siddhesh',
  '',
  '$ systemctl status skills',
  'Python  React  Node.js  TensorFlow',
  '',
  '$ ls ~/projects',
  '> ELI5_Bot/ > Deepfake_Detector/ > Legal_Engine/',
  '',
  '$ echo "Hey there!"',
  'Let’s build something amazing'
];

let lineIndex = 0;
let charIndex = 0;

function typeLine() {
  if (lineIndex >= lines.length) return; // stop when done
  const line = lines[lineIndex];
  if (charIndex < line.length) {
    terminalTextEl.textContent += line.charAt(charIndex);
    charIndex++;
    setTimeout(typeLine, 70);
  } else {
    terminalTextEl.textContent += '\n';
    lineIndex++;
    charIndex = 0;
    setTimeout(typeLine, 400);
  }
}
typeLine();


// === Project card hover preview ===
// const projectPreview = document.getElementById('project-preview');
// document.querySelectorAll('.card[data-img]').forEach(card => {
//   card.addEventListener('mouseenter', e => {
//     const imgUrl = card.getAttribute('data-img');
//     projectPreview.style.backgroundImage = `url(${imgUrl})`;
//     projectPreview.style.opacity = '1';
//   });
//   card.addEventListener('mousemove', e => {
//     projectPreview.style.top = `${e.clientY + 20}px`;
//     projectPreview.style.left = `${e.clientX + 20}px`;
//   });
//   card.addEventListener('mouseleave', () => {
//     projectPreview.style.opacity = '0';
//   });
// });

// === Fetch Medium posts ===
const mediumBlogEl = document.getElementById('medium-blog');
const mediumUser = 'siddheshd114'; // your Medium handle

async function fetchMediumPosts() {
  try {
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUser}`);
    const data = await res.json();
    mediumBlogEl.innerHTML = '';

    data.items.slice(0, 3).forEach(post => {
      const pubDate = new Date(post.pubDate).toLocaleDateString('en-GB', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      const blogCard = document.createElement('div');
      blogCard.className = 'blog-card';

      blogCard.innerHTML = `
        <h3>${post.title}</h3>
        <div class="meta">🗓️ ${pubDate} • ⏱️ ${Math.ceil(post.content.length / 1000)} min read</div>
        <p>${post.description.replace(/<[^>]*>?/gm, '').substring(0, 140)}...</p>
        <a href="${post.link}" target="_blank" rel="noopener">Read →</a>
      `;

      mediumBlogEl.appendChild(blogCard);
    });
  } catch (err) {
    mediumBlogEl.innerHTML = '<p style="color: #888;">Could not load blog posts.</p>';
    console.error(err);
  }
}
fetchMediumPosts();

// === Voice interaction ===
const voiceBtn = document.getElementById('voiceBtn');
const voiceResponse = document.getElementById('voiceResponse');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;

  voiceBtn.addEventListener('click', () => {
    voiceResponse.textContent = 'Listening... 🎙️';
    recognition.start();
  });

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    voiceResponse.textContent = `You said: "${transcript}"`;

    let reply = "Sorry, I didn't get that. Try asking about my projects or skills.";
    if (transcript.includes('eli5')) reply = 'The ELI5 Bot explains complex topics simply using LLMs and Wikipedia.';
    else if (transcript.includes('deepfake')) reply = 'My deepfake detector uses AI models like MTCNN and ResNet50 to identify fake videos.';
    else if (transcript.includes('skills')) reply = 'I am proficient in Python, JavaScript, React, Node.js, TensorFlow, and more.';
    else if (transcript.includes('projects')) reply = 'I have worked on ELI5 Bot, deepfake detection, legal similarity engine, and multiple websites.';

    setTimeout(() => { voiceResponse.textContent = reply; }, 1000);
  };

  recognition.onerror = () => {
    voiceResponse.textContent = 'Voice recognition error. Please try again.';
  };
} else {
  voiceBtn.style.display = 'none';
}

const projectGrid = document.getElementById('projectGrid');
const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');
const allProjectCards = projectGrid.querySelectorAll('.card');

let showingAll = false;

function updateProjectDisplay() {
  allProjectCards.forEach((card, index) => {
    card.style.display = showingAll || index < 4 ? 'block' : 'none';
  });
  toggleProjectsBtn.textContent = showingAll ? 'View Less' : 'View More';
}

toggleProjectsBtn.addEventListener('click', () => {
  showingAll = !showingAll;
  updateProjectDisplay();
});

// Initial setup
updateProjectDisplay();


// === Intersection Observer fade-in effect ===
const faders = document.querySelectorAll('.fade-in');
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
faders.forEach(fader => observer.observe(fader));

// === Navbar active link on scroll ===
const navLinks = document.querySelectorAll('.nav-link');
const sections = [...document.querySelectorAll('main section')];

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});


// Skill tab toggler
// Skill tab toggle logic
const tabs = document.querySelectorAll('.tab');
const skillGroups = document.querySelectorAll('.skill-group');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    skillGroups.forEach(group => group.classList.remove('active'));

    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.target);
    if (target) target.classList.add('active');
  });
});
