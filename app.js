// 1. Supabase-Verbindung einrichten (URL und Keys jetzt an der richtigen Stelle!)
const SUPABASE_URL = 'https://ekytiqnngpcvaskiqgef.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_VdIEqUVVCTlE6LkYylkxfg_WbXsixEJ'; 

// Nutzen des globalen Supabase-Objekts aus dem CDN-Skript
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {

    let vokabeln = []; // Startet leer und füllt sich aus der Datenbank

    // Funktion, um die Wörter aus Supabase zu laden
    async function ladeVokabelnAusDatenbank() {
        try {
            console.log("Starte Abruf aus Supabase...");
            // Nutzt die korrekte Tabelle "vocabeln" mit "c"
            const { data, error } = await supabaseClient
                .from('vocabeln') 
                .select('*');

            if (error) {
                throw error;
            }

            // Das leere Array mit den echten Daten befüllen
            vokabeln = data;
            console.log("Erfolgreich geladen:", vokabeln);

        } catch (error) {
            console.error("Fehler beim Laden aus Supabase:", error.message);
            alert("Fehler beim Laden der Datenbank: " + error.message);
        }
    }

    let aktuelleRunde = [];
    let index = 0;
    let richtigesWort = null;
    
    let richtigZaehler = 0;
    let falschZaehler = 0;
    let streakZaehler = 0; 
    let besterStreak = 0;  

    let aktuellerFrageTyp = "MC"; // "MC" für Multiple Choice, "TF" für True/False (Wahr/Falsch)
    let tfRichtung = true;        // Bestimmt bei True/False, ob die gezeigte Aussage wahr oder falsch ist

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
    const weiterBtnText = document.getElementById('weiter-btn-text');
    const aktuelleFrageAnzeige = document.getElementById('aktuelle-frage');
    const gesamteFragenAnzeige = document.getElementById('gesamte-fragen');
    const progressBar = document.getElementById('progress-bar');
    
    const kategorieSelect = document.getElementById('kategorie-select');
    const selectWrapper = document.getElementById('select-wrapper');
    const streakContainer = document.getElementById('streak-container');
    const streakText = document.getElementById('streak-text');

    // Antwort-Boxen für die Fragetypen
    const mcBox = document.getElementById('mc-box');
    const tfBox = document.getElementById('tf-box');

    // Navigation & Dropdown im Menü
    const menuToggle = document.getElementById('menu-toggle');
    const sideNav = document.getElementById('side-nav');
    const navClose = document.getElementById('nav-close');
    const navHome = document.getElementById('nav-home');
    const navKategorieSelect = document.getElementById('nav-kategorie-select');
    const navSelectWrapper = document.getElementById('nav-select-wrapper');

    // Ergebnis-Screen-Elemente
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
        startBtn.addEventListener('click', async () => {
            const buttonText = startBtn.querySelector('span');
            if (buttonText) {
                buttonText.textContent = "Lädt Vokabeln...";
            }
            
            // Erst Daten laden
            await ladeVokabelnAusDatenbank();
            
            // Button-Text wieder zurücksetzen
            if (buttonText) {
                buttonText.textContent = "Reise starten!";
            }
            
            // Dann Spiel starten
            spielInitialisieren();
        });
    }

    // --- SPIEL-LOGIK ---
    function spielInitialisieren() {
        if (!vokabeln || vokabeln.length === 0) {
            alert("Es wurden keine Vokabeln geladen. Bitte überprüfe deine Datenbank-Verbindung.");
            return;
        }

        const gewaehlteKategorie = kategorieSelect.value;
        const textKategorie = kategorieSelect.options[kategorieSelect.selectedIndex].text;
        
        navKategorieSelect.value = gewaehlteKategorie;
        
        container.classList.add('game-active');
        mainHeading.textContent = `Kapitel: ${textKategorie}`;

        startScreen.classList.add('hidden');
        if (resultScreen) resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        if (gewaehlteKategorie === "alle") {
            aktuelleRunde = [...vokabeln];
        } else {
            aktuelleRunde = vokabeln.filter(v => v.kategorie === gewaehlteKategorie);
        }
        
        if (aktuelleRunde.length === 0) {
            alert("Keine Vokabeln in dieser Kategorie gefunden!");
            goBackToStart();
            return;
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
        weiterBtnText.textContent = "Nächste Frage";
        
        aktuelleFrageAnzeige.textContent = index + 1;
        
        const prozent = ((index + 1) / aktuelleRunde.length) * 100;
        progressBar.style.width = `${prozent}%`;

        richtigesWort = aktuelleRunde[index];

        // Alle Antwortbuttons für die neue Runde visuell zurücksetzen und aktivieren
        antwortButtons.forEach(btn => {
            btn.className = "antwort-btn"; 
            if (btn.classList.contains('tf-btn')) {
                btn.className = "antwort-btn tf-btn"; 
            }
            btn.disabled = false;
        });

        // Zufällige Auswahl des Fragetyps (50% Multiple Choice, 50% Wahr / Falsch)
        aktuellerFrageTyp = Math.random() < 0.5 ? "MC" : "TF";

        const bubbleCaption = document.querySelector('.bubble-caption');

        if (aktuellerFrageTyp === "MC") {
            // Layout umschalten
            if (mcBox) mcBox.classList.remove('hidden');
            if (tfBox) tfBox.classList.add('hidden');

            if (bubbleCaption) bubbleCaption.textContent = "WAS BEDEUTET DAS WORT?";
            wortAnzeige.innerHTML = `<strong>"${richtigesWort.wort_tagalog}"</strong>`;

            const gewaehlteKategorie = kategorieSelect.value;
            let falscheOptionen = [];

            if (gewaehlteKategorie === "alle") {
                falscheOptionen = vokabeln.filter(v => v.wort_deutsch !== richtigesWort.wort_deutsch);
            } else {
                falscheOptionen = vokabeln.filter(v => v.kategorie === gewaehlteKategorie && v.wort_deutsch !== richtigesWort.wort_deutsch);
                
                if (falscheOptionen.length < 3) {
                    let restlicheWoerter = vokabeln.filter(v => v.kategorie !== gewaehlteKategorie && v.wort_deutsch !== richtigesWort.wort_deutsch);
                    restlicheWoerter.sort(() => Math.random() - 0.5);
                    while (falscheOptionen.length < 3 && restlicheWoerter.length > 0) {
                        falscheOptionen.push(restlicheWoerter.pop());
                    }
                }
            }
            
            falscheOptionen.sort(() => Math.random() - 0.5);

            let optionen = [
                richtigesWort.wort_deutsch, 
                falscheOptionen[0]?.wort_deutsch || "---", 
                falscheOptionen[1]?.wort_deutsch || "---", 
                falscheOptionen[2]?.wort_deutsch || "---"
            ];
            optionen.sort(() => Math.random() - 0.5);

            // Nur die Buttons innerhalb der Multiple-Choice Box befüllen
            if (mcBox) {
                const mcButtons = mcBox.querySelectorAll('.antwort-btn');
                mcButtons.forEach((btn, i) => {
                    btn.style.display = 'block';
                    btn.textContent = optionen[i];
                });
            }

        } else {
            // Layout umschalten
            if (mcBox) mcBox.classList.add('hidden');
            if (tfBox) tfBox.classList.remove('hidden');

            if (bubbleCaption) bubbleCaption.textContent = "STIMMT DIESE AUSSAGE?";

            // 50% Chance ob die Behauptung WAHR oder FALSCH sein soll
            tfRichtung = Math.random() < 0.5;

            if (tfRichtung) {
                // Wahre Aussage generieren: XY bedeutet XY
                wortAnzeige.innerHTML = `<strong>"${richtigesWort.wort_tagalog}"</strong> bedeutet <strong>"${richtigesWort.wort_deutsch}"</strong>`;
            } else {
                // Falsche Aussage generieren (Ablenkung aus gleicher Kategorie oder Restpool ziehen)
                const gewaehlteKategorie = kategorieSelect.value;
                let poolFuerFalscheAussage = [];

                if (gewaehlteKategorie === "alle") {
                    poolFuerFalscheAussage = vokabeln.filter(v => v.wort_deutsch !== richtigesWort.wort_deutsch);
                } else {
                    poolFuerFalscheAussage = vokabeln.filter(v => v.kategorie === gewaehlteKategorie && v.wort_deutsch !== richtigesWort.wort_deutsch);
                    if (poolFuerFalscheAussage.length === 0) {
                        poolFuerFalscheAussage = vokabeln.filter(v => v.wort_deutsch !== richtigesWort.wort_deutsch);
                    }
                }

                poolFuerFalscheAussage.sort(() => Math.random() - 0.5);
                const zufaelligesFalschesWort = poolFuerFalscheAussage[0]?.wort_deutsch || "etwas anderes";

                // Falsche Aussage generieren: XY bedeutet XY
                wortAnzeige.innerHTML = `<strong>"${richtigesWort.wort_tagalog}"</strong> bedeutet <strong>"${zufaelligesFalschesWort}"</strong>`;
            }
        }
    }

    function antwortPruefen(e) {
        const geklickterButton = e.target;
        
        // Alle Antwortbuttons sofort sperren
        antwortButtons.forEach(btn => btn.disabled = true);

        let istRichtig = false;

        if (aktuellerFrageTyp === "MC") {
            const gewaehlteAntwort = geklickterButton.textContent;
            istRichtig = (gewaehlteAntwort === richtigesWort.wort_deutsch);

            if (istRichtig) {
                geklickterButton.classList.add('richtig-vollflaechig');
            } else {
                geklickterButton.classList.add('falsch-vollflaechig');
                // Richtige MC-Option grün hervorheben
                const mcButtons = mcBox.querySelectorAll('.antwort-btn');
                mcButtons.forEach(btn => {
                    if (btn.textContent === richtigesWort.wort_deutsch) {
                        btn.classList.add('richtig-vollflaechig');
                    }
                });
            }
        } else {
            // Wahr / Falsch Modus auswerten
            const gewaehlteAntwort = geklickterButton.getAttribute('data-value'); // "Wahr" oder "Falsch"
            
            if ((tfRichtung && gewaehlteAntwort === "Wahr") || (!tfRichtung && gewaehlteAntwort === "Falsch")) {
                istRichtig = true;
            }

            if (istRichtig) {
                geklickterButton.classList.add('richtig-vollflaechig');
            } else {
                geklickterButton.classList.add('falsch-vollflaechig');
                // Den anderen TF-Button grün hervorheben
                const tfButtons = tfBox.querySelectorAll('.antwort-btn');
                tfButtons.forEach(btn => {
                    if (btn !== geklickterButton) {
                        btn.classList.add('richtig-vollflaechig');
                    }
                });
            }
        }

        // Streak- & Statistik-Berechnung
        if (istRichtig) {
            richtigZaehler++;
            streakZaehler++;
            
            if (streakZaehler > besterStreak) {
                besterStreak = streakZaehler;
            }
            
            streakText.textContent = `${streakZaehler}x Streak 🔥`;
            streakContainer.style.display = 'flex'; 

            feedbackAnzeige.innerHTML = `<span>✅ <strong>Das ist absolut richtig!</strong> Du hast die Frage perfekt beantwortet.</span>`;
            feedbackAnzeige.className = "feedback-box richtig-text";
        } else {
            falschZaehler++;
            streakZaehler = 0;
            streakContainer.style.display = 'none'; 

            if (aktuellerFrageTyp === "MC") {
                feedbackAnzeige.innerHTML = `<span>❌ <strong>Leider nicht ganz richtig.</strong> Die richtige Antwort wäre <strong>${richtigesWort.wort_deutsch}</strong> gewesen.</span>`;
            } else {
                feedbackAnzeige.innerHTML = `<span>❌ <strong>Leider falsch!</strong> In Wirklichkeit bedeutet <strong>"${richtigesWort.wort_tagalog}"</strong> nämlich <strong>"${richtigesWort.wort_deutsch}"</strong>.</span>`;
            }
            feedbackAnzeige.className = "feedback-box falsch-text";
        }

        if (index === aktuelleRunde.length - 1) {
            weiterBtnText.textContent = "Test absenden";
        }

        weiterBtn.style.display = 'flex'; 
    }

    // --- INTERAKTIVE ERGEBNIS-STEUERUNG ---
    function zeigeTestergebnis() {
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        resultKamiImg.src = 'kami_zufrieden.png';
        showDetailsBtn.classList.remove('hidden');
        restartBtn.classList.add('hidden');
        
        resultSpeechContent.innerHTML = `
            <p><strong>Geschafft! 🌟</strong></p>
            <p>Du hast den Test beendet! Du kannst richtig stolz auf dich sein – ganz egal, wie es gelaufen ist. Es ist schließlich noch kein Meister vom Himmel gefallen und Sprachen lernen ist ein wunderbarer Prozess! Bleib dran!</p>
        `;

        showDetailsBtn.onclick = function() {
            showDetailsBtn.classList.add('hidden');
            restartBtn.classList.remove('hidden');
            
            const gesamtFragen = richtigZaehler + falschZaehler;
            const istGut = richtigZaehler >= (gesamtFragen / 2);
            
            if (istGut) {
                resultKamiImg.src = 'kami_überrascht.png';
                resultSpeechContent.innerHTML = `
                    <p><strong>Wow, ich bin beeindruckt! 😮🎉</strong></p>
                    <p>Das lief richtig super! Hier ist deine Auswertung:</p>
                    <p class="stat-line">✅ Richtig: <strong>${richtigZaehler}</strong></p>
                    <p class="stat-line">❌ Falsch: <strong>${falschZaehler}</strong></p>
                    <p class="stat-line">🔥 Bester Streak: <strong>${besterStreak} am Stück!</strong></p>
                `;
            } else {
                resultKamiImg.src = 'kami_fragend.png';
                resultSpeechContent.innerHTML = `
                    <p><strong>Hm, lass uns mal schauen... 🤔💡</strong></p>
                    <p>Da waren ein paar knifflige Wörter dabei, oder? Macht gar nichts! Deine Statistik:</p>
                    <p class="stat-line">✅ Richtig: <strong>${richtigZaehler}</strong></p>
                    <p class="stat-line">❌ Falsch: <strong>${falschZaehler}</strong></p>
                    <p class="stat-line">🔥 Bester Streak: <strong>${besterStreak} am Stück!</strong></p>
                    <p class="final-motivation-line">Übung macht den Pinoy-Meister. Gleich nochmal probieren?</p>
                `;
            }
        };

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
