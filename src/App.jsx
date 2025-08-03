import { useState, useEffect } from "react";

// ----- Card Data -----------------------------------------------------------

const SNIPER_CARDS = [
  { type: "bonus", text: "Free Run: You can freely run or move before your shot!" },
  { type: "bonus", text: "Second Chance: If you miss, you get one extra kick!" },
  { type: "bonus", text: "Close Range: Move one large step closer to the goal!" },
  { type: "bonus", text: "Crossbar Bonus: Hitting the crossbar counts as scoring a goal!" },
  { type: "penalty", text: "Dizzy Spin: Spin around 5 times before kicking!" },
  { type: "penalty", text: "Weak Foot: You must shoot using your weaker foot!" },
  { type: "penalty", text: "Blindfolded Shot: Cover your eyes completely while kicking!" },
  { type: "penalty", text: "Sitting Kick: Shoot the ball while sitting on the ground!" },
  { type: "neutral", text: "Fair Shot: No bonus, no penalty—normal shot!" }
];

const GOALKEEPER_CARDS = [
  { type: "bonus", text: "Goalie Charge: You can freely run forward to defend!" },
  { type: "bonus", text: "Long Shot: Shooter moves two large steps back from the spot!" },
  { type: "bonus", text: "Smaller Ball: Shooter must use a smaller ball!" },
  { type: "bonus", text: "Angled Shot: Sniper must shoot from a difficult angle (side)!" },
  { type: "penalty", text: "Oversized Keeper: Wear oversized clothing while defending!" },
  { type: "penalty", text: "One-Eyed Keeper: Cover one eye during your defense!" },
  { type: "penalty", text: "Empty Net: Start outside the goal when the shooter begins!" },
  { type: "penalty", text: "Backward Defender: Face backward until you hear the kick!" },
  { type: "neutral", text: "Fair Defense: No bonus, no penalty—normal defense!" }
];

// ----- Helper Functions ----------------------------------------------------

const IMAGE_URLS = {
  background: "https://olvnikon.github.io/silly-football/dist/assets/background.png",
  bonus: "https://olvnikon.github.io/silly-football/dist/assets/bonus.png",
  penalty: "https://olvnikon.github.io/silly-football/dist/assets/penalty.png",
  neutral: "https://olvnikon.github.io/silly-football/dist/assets/neutral.png"
};

function preloadImages() {
  Object.values(IMAGE_URLS).forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

function getCardBackground(type) {
  const key = type === "penalty" ? "penalty"
            : type === "bonus"   ? "bonus"
            : "neutral";
  return `url('${IMAGE_URLS[key]}')`;
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ----- Main Component ------------------------------------------------------

export function App() {
  // Viewed screen: "start" | "game"
  const [view, setView] = useState("start");
  const [round, setRound] = useState(1);

  // Remaining cards, shuffled once on first START
  const [sniperDeck, setSniperDeck] = useState([]);
  const [keeperDeck, setKeeperDeck] = useState([]);

  // Selected cards for the current round (null until chosen)
  const [sniperPick, setSniperPick] = useState(null);
  const [keeperPick, setKeeperPick] = useState(null);

  // Preload all images on mount
  useEffect(preloadImages, []);


  // --- Event Handlers ------------------------------------------------------
  
  function startGame() {
    setSniperDeck(shuffleArray(SNIPER_CARDS));
    setKeeperDeck(shuffleArray(GOALKEEPER_CARDS));
    setView("game");
  }

  function pickSniper() {
    if (sniperDeck.length === 0) return; // safety
    const idx = Math.floor(Math.random() * sniperDeck.length);
    const card = sniperDeck[idx];
    setSniperPick(card);
    setSniperDeck(sniperDeck.filter((_, i) => i !== idx));
  }

  function pickKeeper() {
    if (keeperDeck.length === 0) return; // safety
    const idx = Math.floor(Math.random() * keeperDeck.length);
    const card = keeperDeck[idx];
    setKeeperPick(card);
    setKeeperDeck(keeperDeck.filter((_, i) => i !== idx));
  }

  function nextRound() {
    setSniperPick(null);
    setKeeperPick(null);
    setRound(r => r + 1);
  }

  function enableFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }

  // --- Rendering helpers ---------------------------------------------------

  function renderStartScreen() {
    return (
      <div style={styles.centerColumn}>
        <button style={styles.startButton} onClick={startGame}>START</button>
      </div>
    );
  }

  function renderCard(card) {
    if (!card) return null;
    return (
      <div style={{ ...styles.card, backgroundImage: getCardBackground(card.type) }}>
        <p style={styles.cardText}>{card.text}</p>
      </div>
    );
  }

  function renderGameScreen() {
    const bothPicked = sniperPick && keeperPick;
    return (
      <div style={styles.gameContainer}>
        <h1 style={styles.roundLabel}>Round {round}</h1>

        <div style={styles.cardsRow}>
          {/* Sniper column */}
          <div style={styles.column}>
            {!sniperPick && (
              <button style={styles.roleButton} onClick={pickSniper}>Sniper</button>
            )}
            {renderCard(sniperPick)}
          </div>

          {/* Goalkeeper column */}
          <div style={styles.column}>
            {!keeperPick && (
              <button style={styles.roleButton} onClick={pickKeeper}>Goalkeeper</button>
            )}
            {renderCard(keeperPick)}
          </div>
        </div>

        {/* Next round button, visible only if both picked and not last round */}
        {bothPicked && round < 9 && (
          <button style={styles.nextButton} onClick={nextRound}>Next round</button>
        )}

        {/* End of game message */}
        {bothPicked && round === 9 && (
          <p style={styles.gameOver}>All rounds completed!</p>
        )}
      </div>
    );
  }

  return (
    <div style={styles.fullScreen} onClick={enableFullscreen}>
      {view === "start" ? renderStartScreen() : renderGameScreen()}
    </div>
  );
}

// ----- Styles --------------------------------------------------------------

const styles = {
  fullScreen: {
    height: "100vh",
    width: "100vw",
    backgroundImage: `url('${IMAGE_URLS.background}')`,
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "#fff",
    textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
    fontFamily: "Arial, sans-serif"
  },
  centerColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2vh"
  },
  startButton: {
    fontSize: "4vh",
    padding: "2vh 4vh",
    border: "3px solid black",
    borderRadius: "1vh",
    cursor: "pointer"
  },
  gameContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3vh",
    width: "90vw"
  },
  roundLabel: {
    margin: 0,
    fontSize: "10vh"
  },
  cardsRow: {
    display: "flex",
    gap: "4vw",
    justifyContent: "center",
    width: "100%"
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2vh"
  },
  roleButton: {
    fontSize: "3vh",
    padding: "1.5vh 3vh",
    border: "15px solid orange",
    borderRadius: "1vh",
    cursor: "pointer"
  },
  nextButton: {
    marginTop: "2vh",
    fontSize: "2.5vh",
    padding: "1vh 2vh",
    border: "3px solid black",
    borderRadius: "1vh",
    cursor: "pointer"
  },
  card: {
    /* Responsive sizing: preserve 2:3 aspect ratio */
    width: "20vw",
    height: "30vw",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2vw",
    boxSizing: "border-box",
    borderRadius: "1vw",
    textAlign: "center"
  },
  cardText: {
    fontSize: "3vh",
    fontWeight: "bold",
    lineHeight: "1.2"
  },
  gameOver: {
    fontSize: "3vh",
    fontWeight: "bold"
  }
};

