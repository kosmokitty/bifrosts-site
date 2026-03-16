/* ==========================================
   BIFROSTS — nav loader + hamburger + music
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const navPlaceholder = document.getElementById("nav-placeholder");
    if (!navPlaceholder) return;

    fetch("/nav.html")
        .then(res => {
            if (!res.ok) throw new Error("Nav not found");
            return res.text();
        })
        .then(data => {
            navPlaceholder.innerHTML = data;
            initHamburger();
            initMusic();
        })
        .catch(err => console.error("Nav load error:", err));

});

/* ── Hamburger ── */
function initHamburger() {
    const hamburger = document.getElementById("nav-hamburger");
    const navLinks  = document.getElementById("nav-links");
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("open");
        hamburger.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            hamburger.classList.remove("open");
        });
    });

    document.addEventListener("click", function (e) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove("open");
            hamburger.classList.remove("open");
        }
    });
}

/* ── Music ── */
function initMusic() {
    const music  = document.getElementById("bg-music");
    const toggle = document.getElementById("music-toggle");
    if (!music || !toggle) return;

    music.volume = 0.4;

    const savedTime = localStorage.getItem("musicTime");
    if (savedTime) music.currentTime = parseFloat(savedTime);

    function play() {
        music.play().then(function () {
            toggle.classList.remove("muted");
            localStorage.setItem("musicPlaying", "true");
        }).catch(function () {
            toggle.classList.add("muted");
        });
    }

    function pause() {
        music.pause();
        toggle.classList.add("muted");
        localStorage.setItem("musicPlaying", "false");
    }

    if (localStorage.getItem("musicPlaying") === "true") play();

    toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        music.paused ? play() : pause();
    });

    document.addEventListener("click", function unlock() {
        if (localStorage.getItem("musicPlaying") === "true" && music.paused) play();
        document.removeEventListener("click", unlock);
    }, { once: true });

    setInterval(function () {
        if (!music.paused) localStorage.setItem("musicTime", music.currentTime);
    }, 1000);
}