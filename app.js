document.addEventListener("DOMContentLoaded", () => {

    const alleVokabeln = [
        { kategorie: "Farben", wort_deutsch: "Rot", wort_tagalog: "Pula" },
        { kategorie: "Farben", wort_deutsch: "Blau", wort_tagalog: "Asul" },
        { kategorie: "Farben", wort_deutsch: "Gelb", wort_tagalog: "Dilaw" },
        { kategorie: "Farben", wort_deutsch: "Grün", wort_tagalog: "Berde" },
        { kategorie: "Farben", wort_deutsch: "Schwarz", wort_tagalog: "Itim" },
        { kategorie: "Farben", wort_deutsch: "Weiß", wort_tagalog: "Puti" },
        { kategorie: "Farben", wort_deutsch: "Braun", wort_tagalog: "Kayumanggi" },
        { kategorie: "Farben", wort_deutsch: "Rosa", wort_tagalog: "Rosas" },
        { kategorie: "Farben", wort_deutsch: "Orange", wort_tagalog: "Nalandan" },
        { kategorie: "Farben", wort_deutsch: "Grau", wort_tagalog: "Abuhin" },
        { kategorie: "Tiere", wort_deutsch: "Hund", wort_tagalog: "Aso" },
        { kategorie: "Tiere", wort_deutsch: "Katze", wort_tagalog: "Pusa" },
        { kategorie: "Tiere", wort_deutsch: "Vogel", wort_tagalog: "Ibon" },
        { kategorie: "Tiere", wort_deutsch: "Fisch", wort_tagalog: "Isda" },
        { kategorie: "Tiere", wort_deutsch: "Schwein", wort_tagalog: "Baboy" },
        { kategorie: "Tiere", wort_deutsch: "Huhn", wort_tagalog: "Manok" },
        { kategorie: "Tiere", wort_deutsch: "Kuh", wort_tagalog: "Baka" },
        { kategorie: "Tiere", wort_deutsch: "Pferd", wort_tagalog: "Kabayo" },
        { kategorie: "Tiere", wort_deutsch: "Affe", wort_tagalog: "Unggoy" },
        { kategorie: "Tiere", wort_deutsch: "Maus", wort_tagalog: "Daga" },
        { kategorie: "Essen", wort_deutsch: "Reis", wort_tagalog: "Kanin" },
        { kategorie: "Essen", wort_deutsch: "Fleisch", wort_tagalog: "Karne" },
        { kategorie: "Essen", wort_deutsch: "Gemüse", wort_tagalog: "Gulay" },
        { kategorie: "Essen", wort_deutsch: "Obst", wort_tagalog: "Prutas" },
        { kategorie: "Essen", wort_deutsch: "Brot", wort_tagalog: "Tinapay" },
        { kategorie: "Essen", wort_deutsch: "Ei", wort_tagalog: "Itlog" },
        { kategorie: "Essen", wort_deutsch: "Fisch (Speise)", wort_tagalog: "Ulam" },
        { kategorie: "Essen", wort_deutsch: "Wasser", wort_tagalog: "Tubig" },
        { kategorie: "Essen", wort_deutsch: "Milch", wort_tagalog: "Gatas" },
        { kategorie: "Essen", wort_deutsch: "Suppe", wort_tagalog: "Sabaw" },
        { kategorie: "Begrüßungen", wort_deutsch: "Hallo / Guten Tag", wort_tagalog: "Kamusta" },
        { kategorie: "Begrüßungen", wort_deutsch: "Guten Morgen", wort_tagalog: "Magandang umaga" },
        { kategorie: "Begrüßungen", wort_deutsch: "Guten Abend", wort_tagalog: "Magandang gabi" },
        { kategorie: "Begrüßungen", wort_deutsch: "Danke", wort_tagalog: "Salamat" },
        { kategorie: "Begrüßungen", wort_deutsch: "Vielen Dank", wort_tagalog: "Maraming salamat" },
        { kategorie: "Begrüßungen", wort_deutsch: "Bitte / Gern geschehen", wort_tagalog: "Walang anuman" },
        { kategorie: "Begrüßungen", wort_deutsch: "Wie geht es dir?", wort_tagalog: "Kamusta ka?" },
        { kategorie: "Begrüßungen", wort_deutsch: "Gut", wort_tagalog: "Mabuti" },
        { kategorie: "Begrüßungen", wort_deutsch: "Auf Wiedersehen", wort_tagalog: "Paalam" },
        { kategorie: "Begrüßungen", wort_deutsch: "Tschüss (informell)", wort_tagalog: "Sige na" },
        { kategorie: "Zahlen", wort_deutsch: "Eins", wort_tagalog: "Isa" },
        { kategorie: "Zahlen", wort_deutsch: "Zwei", wort_tagalog: "Dalawa" },
        { kategorie: "Zahlen", wort_deutsch: "Drei", wort_tagalog: "Tatlo" },
        { kategorie: "Zahlen", wort_deutsch: "Vier", wort_tagalog: "Apat" },
        { kategorie: "Zahlen", wort_deutsch: "Fünf", wort_tagalog: "Lima" },
        { kategorie: "Zahlen", wort_deutsch: "Sechs", wort_tagalog: "Anim" },
        { kategorie: "Zahlen", wort_deutsch: "Sieben", wort_tagalog: "Pito" },
        { kategorie: "Zahlen", wort_deutsch: "Acht", wort_tagalog: "Walo" },
        { kategorie: "Zahlen", wort_deutsch: "Neun", wort_tagalog: "Siyam" },
        { kategorie: "Zahlen", wort_deutsch: "Zehn", wort_tagalog: "Sampu" }
    ];

    let aktuelleRunde = [];
    let index = 0;
    let richtigesWort = null;
    
    // Neue Variablen für die Auswertung
    let richtigZaehler = 0;
    let falschZaehler = 0;
    let streakZaehler = 0; // Aktueller Streak
    let besterStreak = 0;  // Höchster Streak am Stück

    // DOM-Elemente
    const container = document.querySelector('.trainer-container');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-btn');
    const mainHeading = document.getElementById('main-heading');

    const wortAnzeige = document.getElementById('gesuchtes-wort');
    const antwortButtons = document.querySelectorAll('.antwort-btn');
    const feedbackAnzeige = document.getElementById('feedback');
    const weiterBtn = document.getElementById('weiter-btn');
    const aktuelleFrageAnzeige = document.getElementById('aktuelle-frage');
    const gesamteFragenAnzeige = document.getElementById('gesamte-fragen');
    const progressBar = document.getElementById('progress-bar');
    
    const kategorieSelect = document.getElementById('kategorie-select');
    const selectWrapper = document.getElementById('select-wrapper');
    const streakContainer = document.getElementById('streak-container');
    const streakText = document.getElementById('streak-text');

    // Navigation & Dropdown im Menü
    const menuToggle = document.getElementById('menu-toggle');
    const sideNav = document.getElementById('side-nav');
    const navClose = document.getElementById('nav-close');
    const navHome = document.getElementById('nav-home');
    const navKategorieSelect = document.getElementById('nav-kategorie-select');
    const navSelectWrapper = document.getElementById('nav-select-wrapper');

    // Neue Ergebnis-Screen-Elemente
    const resultScreen = document.getElementById('result-screen');
    const resultSpeechContent = document.getElementById('result-speech-content');
    const resultKamiImg = document.getElementById('result-kami-img');
    const showDetailsBtn = document.getElementById('show-details-btn');
    const restartBtn = document.getElementById('restart-btn');

    // --- NAVIGATION OVERLAY LOGIK ---
    function openMenu() { sideNav.classList.add('open'); }
    function closeMenu() { sideNav.classList.remove('open'); }

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);

    if (navHome) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
            goBackToStart();
        });
    }

    // Dropdown-Interaktion im Menü
    if (navKategorieSelect) {
        navKategorieSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            navSelectWrapper.classList.toggle('open');
        });

        navKategorieSelect.addEventListener('change', () => {
            navSelectWrapper.classList.remove('open');
            kategorieSelect.value = navKategorieSelect.value;
            closeMenu();
            spielInitialisieren();
        });
    }

    function goBackToStart() {
        container.classList.remove('game-active');
        gameScreen.classList.add('hidden');
        if (resultScreen) resultScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        mainHeading.textContent = "Dein Pinoy Vokabeltrainer";
    }

    // --- SELECTION CONTROL STARTSEITE ---
    if (kategorieSelect) {
        kategorieSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            selectWrapper.classList.toggle('open');
        });
        
        document.addEventListener('click', () => {
            selectWrapper.classList.remove('open');
            if(navSelectWrapper) navSelectWrapper.classList.remove('open');
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            spielInitialisieren();
        });
    }

    // --- SPIEL-LOGIK ---
    function spielInitialisieren() {
        const gewaehlteKategorie = kategorieSelect.value;
        const textKategorie = kategorieSelect.options[kategorieSelect.selectedIndex].text;
        
        navKategorieSelect.value = gewaehlteKategorie;
        
        container.classList.add('game-active');
        mainHeading.textContent = `Kapitel: ${textKategorie}`;

        startScreen.classList.add('hidden');
        if (resultScreen) resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        if (gewaehlteKategorie === "alle") {
            aktuelleRunde = [...alleVokabeln];
        } else {
            aktuelleRunde = alleVokabeln.filter(v => v.kategorie === gewaehlteKategorie);
        }
        
        aktuelleRunde.sort(() => Math.random() - 0.5);
        if (aktuelleRunde.length > 10) aktuelleRunde = aktuelleRunde.slice(0, 10);

        index = 0;
        richtigZaehler = 0;
        falschZaehler = 0;
        streakZaehler = 0;
        besterStreak = 0;
        streakContainer.style.display = 'none'; 
        gesamteFragenAnzeige.textContent = aktuelleRunde.length;
        frageLaden();
    }

    function frageLaden() {
        if (index >= aktuelleRunde.length) {
            zeigeTestergebnis();
            return;
        }

        feedbackAnzeige.textContent = "";
        feedbackAnzeige.className = "feedback-box";
        weiterBtn.style.display = 'none';
        aktuelleFrageAnzeige.textContent = index + 1;
        
        const prozent = ((index + 1) / aktuelleRunde.length) * 100;
        progressBar.style.width = `${prozent}%`;

        richtigesWort = aktuelleRunde[index];
        wortAnzeige.textContent = richtigesWort.wort_tagalog;

        let falscheOptionen = alleVokabeln.filter(v => v.wort_deutsch !== richtigesWort.wort_deutsch);
        falscheOptionen.sort(() => Math.random() - 0.5);

        let optionen = [richtigesWort.wort_deutsch, falscheOptionen[0].wort_deutsch, falscheOptionen[1].wort_deutsch, falscheOptionen[2].wort_deutsch];
        optionen.sort(() => Math.random() - 0.5);

        antwortButtons.forEach((btn, i) => {
            btn.style.display = 'block';
            btn.textContent = optionen[i];
            btn.className = "antwort-btn"; 
            btn.disabled = false;
        });
    }

    function antwortPruefen(e) {
        const geklickterButton = e.target;
        const gewaehlteAntwort = geklickterButton.textContent;
        
        antwortButtons.forEach(btn => btn.disabled = true);

        if (gewaehlteAntwort === richtigesWort.wort_deutsch) {
            geklickterButton.classList.add('richtig-vollflaechig');
            
            richtigZaehler++;
            streakZaehler++;
            
            // Besten Streak prüfen
            if (streakZaehler > besterStreak) {
                besterStreak = streakZaehler;
            }
            
            streakText.textContent = `${streakZaehler}x richtig! 🔥`;
            streakContainer.style.display = 'flex'; 

            feedbackAnzeige.innerHTML = `<span>✅ <strong>Das ist absolut richtig!</strong> Du hast das Wort perfekt übersetzt.</span>`;
            feedbackAnzeige.className = "feedback-box richtig-text";
        } else {
            geklickterButton.classList.add('falsch-vollflaechig');
            
            falschZaehler++;
            streakZaehler = 0;
            streakContainer.style.display = 'none'; 

            feedbackAnzeige.innerHTML = `<span>❌ <strong>Leider nicht ganz richtig.</strong> Die richtige Antwort wäre <strong>${richtigesWort.wort_deutsch}</strong> gewesen.</span>`;
            feedbackAnzeige.className = "feedback-box falsch-text";
            
            antwortButtons.forEach(btn => {
                if (btn.textContent === richtigesWort.wort_deutsch) {
                    btn.classList.add('richtig-vollflaechig');
                }
            });
        }
        weiterBtn.style.display = 'flex'; 
    }

    // --- NEUE INTERAKTIVE ERGEBNIS-STEUERUNG ---
    function zeigeTestergebnis() {
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        // Phase 1: Begrüßung durch kami_zufrieden
        resultKamiImg.src = 'kami_zufrieden.png';
        showDetailsBtn.classList.remove('hidden');
        restartBtn.classList.add('hidden');
        
        resultSpeechContent.innerHTML = `
            <p><strong>Geschafft! 🌟</strong></p>
            <p>Du hast den Test beendet! Du kannst richtig stolz auf dich sein – ganz egal, wie es gelaufen ist. Es ist schließlich noch kein Meister vom Himmel gefallen und Sprachen lernen ist ein wunderbarer Prozess! Bleib dran!</p>
        `;

        // Klick auf "Meine Ergebnisse erfahren" (Wechsel zu Phase 2)
        showDetailsBtn.onclick = function() {
            showDetailsBtn.classList.add('hidden');
            restartBtn.classList.remove('hidden');
            
            // Auswertung ob gut oder schlecht (hier definiert als: mindestens die Hälfte richtig)
            const gesamtFragen = richtigZaehler + falschZaehler;
            const istGut = richtigZaehler >= (gesamtFragen / 2);
            
            if (istGut) {
                resultKamiImg.src = 'kami_überrascht.png';
                resultSpeechContent.innerHTML = `
                    <p><strong>Wow, ich bin beeindruckt! 😮🎉</strong></p>
                    <p>Das lief richtig super! Hier ist deine Auswertung:</p>
                    <p style="margin: 5px 0;">✅ Richtig: <strong>${richtigZaehler}</strong></p>
                    <p style="margin: 5px 0;">❌ Falsch: <strong>${falschZaehler}</strong></p>
                    <p style="margin: 5px 0;">🔥 Bester Streak: <strong>${besterStreak} am Stück!</strong></p>
                `;
            } else {
                resultKamiImg.src = 'kami_fragend.png';
                resultSpeechContent.innerHTML = `
                    <p><strong>Hm, lass uns mal schauen... 🤔💡</strong></p>
                    <p>Da waren ein paar knifflige Wörter dabei, oder? Macht gar nichts! Deine Statistik:</p>
                    <p style="margin: 5px 0;">✅ Richtig: <strong>${richtigZaehler}</strong></p>
                    <p style="margin: 5px 0;">❌ Falsch: <strong>${falschZaehler}</strong></p>
                    <p style="margin: 5px 0;">🔥 Bester Streak: <strong>${besterStreak} am Stück!</strong></p>
                    <p style="font-size: 13px; margin-top: 8px; font-weight:600;">Übung macht den Pinoy-Meister. Gleich nochmal probieren?</p>
                `;
            }
        };

        // Klick auf "Zurück zum Start"
        restartBtn.onclick = function() {
            goBackToStart();
        };
    }

    antwortButtons.forEach(btn => btn.addEventListener('click', antwortPruefen));
    if (weiterBtn) {
        weiterBtn.addEventListener('click', () => {
            index++;
            frageLaden();
        });
    }
});
