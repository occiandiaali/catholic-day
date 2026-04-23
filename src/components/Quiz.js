import m from "mithril";
import Menu from "./Menu";

var Quiz = {
  gospelName: "Matthew",
  randomVerse: "",
  blankedVerse: "",
  correctAnswers: [],
  blankIndices: [],
  originalWords: [],
  userAnswers: [],
  loading: false,
  feedback: "",
  level: 1,
  cooldown: false,

  gospelMap: {
    Matthew: [
      25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35,
      30, 34, 46, 46, 39, 51, 46, 75, 66, 20,
    ],
    Mark: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
    Luke: [
      80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43,
      48, 47, 38, 71, 56, 53,
    ],
    John: [
      51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40,
      42, 31, 25,
    ],
  },

  setGospelName(value) {
    Quiz.gospelName = value;
  },

  setLevel(value) {
    Quiz.level = parseInt(value, 10);
  },

  getRandomVerse() {
    if (Quiz.cooldown) return;
    Quiz.cooldown = true;
    setTimeout(() => (Quiz.cooldown = false), 5000);

    const gospel = Quiz.gospelName;
    const chapters = Quiz.gospelMap[gospel];
    if (!chapters) {
      Quiz.randomVerse = "Please select Matthew, Mark, Luke, or John.";
      return;
    }

    const randomChapterIndex = Math.floor(Math.random() * chapters.length);
    const randomChapter = randomChapterIndex + 1;
    const maxVerses = chapters[randomChapterIndex];
    const randomVerse = Math.floor(Math.random() * maxVerses) + 1;

    Quiz.loading = true;
    Quiz.feedback = "";
    Quiz.randomVerse = "";
    Quiz.blankedVerse = "";
    Quiz.correctAnswers = [];
    Quiz.blankIndices = [];
    Quiz.originalWords = [];
    Quiz.userAnswers = [];

    m.request({
      method: "GET",
      url: `https://bible-api.com/${gospel}+${randomChapter}:${randomVerse}`,
    }).then(function (result) {
      Quiz.loading = false;
      if (result && result.text) {
        Quiz.randomVerse = `${result.reference}: ${result.text}`;
        const words = result.text.split(" ");
        Quiz.originalWords = words.slice();

        const blankIndices = [];
        while (blankIndices.length < Quiz.level) {
          const idx = Math.floor(Math.random() * words.length);
          if (!blankIndices.includes(idx)) blankIndices.push(idx);
        }

        // Sort blanks left-to-right
        blankIndices.sort((a, b) => a - b);

        Quiz.correctAnswers = blankIndices.map((i) =>
          words[i].replace(/[^a-zA-Z]/g, ""),
        );
        Quiz.blankIndices = blankIndices;
        Quiz.userAnswers = Array(blankIndices.length).fill("");

        blankIndices.forEach((i, idx) => {
          const original = Quiz.correctAnswers[idx];
          const firstLetter = original.charAt(0);
          const hint = `${firstLetter}${"_".repeat(Math.max(original.length - 1, 3))}`;
          words[i] = hint;
        });

        Quiz.blankedVerse = `${result.reference}: ${words.join(" ")}`;
      } else {
        Quiz.randomVerse = "Could not fetch verse.";
      }
      m.redraw();
    });
  },

  checkAnswer() {
    const correct = Quiz.correctAnswers.map((w) => w.toLowerCase());
    const user = Quiz.userAnswers.map((w) => w.toLowerCase());

    let allCorrect = true;
    let correctCount = 0;
    const reconstructed = Quiz.originalWords.slice();

    Quiz.blankIndices.forEach((i, idx) => {
      if (user[idx] === correct[idx]) {
        reconstructed[i] = m("span.correct", Quiz.userAnswers[idx] + " ✅");
        correctCount++;
      } else {
        reconstructed[i] = m(
          "span.incorrect",
          (Quiz.userAnswers[idx] || "—") +
            " ❌ (correct: " +
            Quiz.correctAnswers[idx] +
            ")",
        );
        allCorrect = false;
      }
    });

    if (allCorrect) {
      Quiz.feedback = m("span.termsP", "✅ Correct!");
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      Quiz.feedback = [
        m("p.termsP", "❌ Some answers were wrong."),

        m("p.termsP", "Verse with your answers:"),
        m("p.termsP", [
          Quiz.randomVerse.split(":")[0] + ": ",
          reconstructed.map((w) =>
            typeof w === "string" ? w + " " : [w, " "],
          ),
        ]),
        m(
          "p.termsP",
          `Score: ${correctCount} out of ${Quiz.correctAnswers.length}`,
        ),
      ];
    }
  },

  view() {
    return [
      m(Menu),
      m("div.main", [
        m("h1.header", "📌Test your catechism"),
        m("div", [
          m("form.namesForm", [
            ["Matthew", "Mark", "Luke", "John"].map((g) =>
              m("label.termsP", [
                m("input[type=radio][name=gospel]", {
                  value: g,
                  checked: Quiz.gospelName === g,
                  onclick: () => Quiz.setGospelName(g),
                }),
                g,
              ]),
            ),
          ]),
          // m("p.termsP", "You've chosen: " + Quiz.gospelName),
          m("p.termsP", "Try verses from: " + Quiz.gospelName),

          m("label.termsP", [
            "Difficulty Level: ",
            m(
              "select.selectField",
              {
                onchange: (e) => Quiz.setLevel(e.target.value),
                value: Quiz.level,
              },
              [
                m("option", { value: 1 }, "Level 1 (one blank)"),
                m("option", { value: 2 }, "Level 2 (two blanks)"),
                m("option", { value: 3 }, "Level 3 (three blanks)"),
              ],
            ),
          ]),

          m(
            "button",
            {
              onclick: Quiz.getRandomVerse,
              disabled: Quiz.loading || Quiz.cooldown,
            },
            Quiz.loading ? "Loading..." : "Get Random Verse",
          ),

          Quiz.blankedVerse &&
            m("div.quizSection", [
              m("p.termsP", "Fill in the missing word(s):"),
              m("p.termsP", Quiz.blankedVerse),

              Quiz.blankIndices.map((_, idx) =>
                m("input[type=text].inputBlank", {
                  placeholder: `Blank ${idx + 1}`,
                  value: Quiz.userAnswers[idx],
                  oninput: (e) =>
                    (Quiz.userAnswers[idx] = e.target.value.trim()),
                }),
              ),

              m("button", { onclick: Quiz.checkAnswer }, "Check Answer"),
              m("div.feedback", [
                Quiz.feedback &&
                  m("button", { onclick: Quiz.getRandomVerse }, "Next Verse"),
                Quiz.feedback,
              ]),
            ]),
        ]),
      ]),
    ];
  },
};

export default Quiz;

//#############################################################
// import m from "mithril";
// import Menu from "./Menu";

// var Quiz = {
//   gospelName: "Matthew",
//   randomVerse: "",
//   blankedVerse: "",
//   correctAnswers: [],
//   blankIndices: [],
//   originalWords: [],
//   userAnswers: [],
//   loading: false,
//   feedback: "",
//   level: 1,
//   cooldown: false,

//   // Progress tracking
//   totalAnswered: 0,
//   totalCorrect: 0,

//   // Gospel leaderboard tracking
//   gospelScores: {
//     Matthew: 0,
//     Mark: 0,
//     Luke: 0,
//     John: 0,
//   },

//   gospelMap: {
//     Matthew: [
//       25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35,
//       30, 34, 46, 46, 39, 51, 46, 75, 66, 20,
//     ],
//     Mark: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
//     Luke: [
//       80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43,
//       48, 47, 38, 71, 56, 53,
//     ],
//     John: [
//       51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40,
//       42, 31, 25,
//     ],
//   },

//   initScores() {
//     if (localStorage.getItem("gospelScores")) {
//       Quiz.gospelScores = JSON.parse(localStorage.getItem("gospelScores"));
//     }
//   },

//   setGospelName(value) {
//     Quiz.gospelName = value;
//   },

//   setLevel(value) {
//     Quiz.level = parseInt(value, 10);
//   },

//   getRandomVerse() {
//     if (Quiz.cooldown) return;
//     Quiz.cooldown = true;
//     setTimeout(() => (Quiz.cooldown = false), 5000);

//     const gospel = Quiz.gospelName;
//     const chapters = Quiz.gospelMap[gospel];
//     if (!chapters) {
//       Quiz.randomVerse = "Please select Matthew, Mark, Luke, or John.";
//       return;
//     }

//     const randomChapterIndex = Math.floor(Math.random() * chapters.length);
//     const randomChapter = randomChapterIndex + 1;
//     const maxVerses = chapters[randomChapterIndex];
//     const randomVerse = Math.floor(Math.random() * maxVerses) + 1;

//     Quiz.loading = true;
//     Quiz.feedback = "";
//     Quiz.randomVerse = "";
//     Quiz.blankedVerse = "";
//     Quiz.correctAnswers = [];
//     Quiz.blankIndices = [];
//     Quiz.originalWords = [];
//     Quiz.userAnswers = [];

//     m.request({
//       method: "GET",
//       url: `https://bible-api.com/${gospel}+${randomChapter}:${randomVerse}`,
//     }).then(function (result) {
//       Quiz.loading = false;
//       if (result && result.text) {
//         Quiz.randomVerse = `${result.reference}: ${result.text}`;
//         const words = result.text.split(" ");
//         Quiz.originalWords = words.slice();

//         const blankIndices = [];
//         while (blankIndices.length < Quiz.level) {
//           const idx = Math.floor(Math.random() * words.length);
//           if (!blankIndices.includes(idx)) blankIndices.push(idx);
//         }

//         // Sort blanks left-to-right
//         blankIndices.sort((a, b) => a - b);

//         Quiz.correctAnswers = blankIndices.map((i) =>
//           words[i].replace(/[^a-zA-Z]/g, ""),
//         );
//         Quiz.blankIndices = blankIndices;
//         Quiz.userAnswers = Array(blankIndices.length).fill("");

//         blankIndices.forEach((i, idx) => {
//           const original = Quiz.correctAnswers[idx];
//           const firstLetter = original.charAt(0);
//           const hint = `${firstLetter}${"_".repeat(Math.max(original.length - 1, 3))}`;
//           words[i] = hint;
//         });

//         Quiz.blankedVerse = `${result.reference}: ${words.join(" ")}`;
//       } else {
//         Quiz.randomVerse = "Could not fetch verse.";
//       }
//       m.redraw();
//     });
//   },

//   checkAnswer() {
//     const correct = Quiz.correctAnswers.map((w) => w.toLowerCase());
//     const user = Quiz.userAnswers.map((w) => w.toLowerCase());

//     let allCorrect = true;
//     let correctCount = 0;
//     const reconstructed = Quiz.originalWords.slice();

//     Quiz.blankIndices.forEach((i, idx) => {
//       if (user[idx] === correct[idx]) {
//         reconstructed[i] = m("span.correct", Quiz.userAnswers[idx] + " ✅");
//         correctCount++;
//       } else {
//         reconstructed[i] = m(
//           "span.incorrect",
//           (Quiz.userAnswers[idx] || "—") +
//             " ❌ (correct: " +
//             Quiz.correctAnswers[idx] +
//             ")",
//         );
//         allCorrect = false;
//       }
//     });

//     // Update overall progress
//     Quiz.totalAnswered += Quiz.correctAnswers.length;
//     Quiz.totalCorrect += correctCount;

//     if (allCorrect) {
//       //  Quiz.feedback = "✅ Correct!";
//       Quiz.feedback = [
//         m("p.termsP", "✅ Correct!"),
//         m(
//           "p.termsP",
//           `Overall Progress: ${Quiz.totalCorrect} correct out of ${Quiz.totalAnswered} blanks`,
//         ),
//       ];
//       // Increment Gospel score
//       Quiz.gospelScores[Quiz.gospelName] += 1;
//       localStorage.setItem("gospelScores", JSON.stringify(Quiz.gospelScores));

//       if (window.confetti) {
//         window.confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 },
//         });
//       }
//     } else {
//       Quiz.feedback = [
//         m("p.termsP", "❌ Some answers were wrong."),
//         m("p.termsP", "Verse with your answers:"),
//         m("p.termsP", [
//           Quiz.randomVerse.split(":")[0] + ": ",
//           reconstructed.map((w) =>
//             typeof w === "string" ? w + " " : [w, " "],
//           ),
//         ]),
//         m(
//           "p.termsP",
//           `Score: ${correctCount} out of ${Quiz.correctAnswers.length}`,
//           m(
//             "p.termsP",
//             `Overall Progress: ${Quiz.totalCorrect} correct out of ${Quiz.totalAnswered} blanks`,
//           ),
//         ),
//       ];
//     }
//   },
//   progress: JSON.parse(localStorage.getItem("gospelScores")),
//   view() {
//     return [
//       m(Menu),
//       m("div.main", [
//         m("h1.header", "📌Test your catechism"),
//         m("div", [
//           m("form.namesForm", [
//             ["Matthew", "Mark", "Luke", "John"].map((g) =>
//               m("label.termsP", [
//                 m("input[type=radio][name=gospel]", {
//                   value: g,
//                   checked: Quiz.gospelName === g,
//                   onclick: () => Quiz.setGospelName(g),
//                 }),
//                 g,
//               ]),
//             ),
//           ]),
//           m("pre.termsP", "Progress:", JSON.stringify(Quiz.progress, null, 2)),

//           m("p.termsP", "You've chosen: " + Quiz.gospelName),

//           m("label.termsP", [
//             "Difficulty Level: ",
//             m(
//               "select.selectField",
//               {
//                 onchange: (e) => Quiz.setLevel(e.target.value),
//                 value: Quiz.level,
//               },
//               [
//                 m("option", { value: 1 }, "Level 1 (one blank)"),
//                 m("option", { value: 2 }, "Level 2 (two blanks)"),
//                 m("option", { value: 3 }, "Level 3 (three blanks)"),
//               ],
//             ),
//           ]),

//           m(
//             "button",
//             {
//               onclick: Quiz.getRandomVerse,
//               disabled: Quiz.loading || Quiz.cooldown,
//             },
//             Quiz.loading ? "Loading..." : "Get Random Verse",
//           ),

//           Quiz.blankedVerse &&
//             m("div.quizSection", [
//               m("p.termsP", "Fill in the missing word(s):"),
//               m("p.termsP", Quiz.blankedVerse),

//               Quiz.blankIndices.map((_, idx) =>
//                 m("input[type=text].inputBlank", {
//                   placeholder: `Blank ${idx + 1}`,
//                   value: Quiz.userAnswers[idx],
//                   oninput: (e) => (Quiz.userAnswers[idx] = e.target.value),
//                 }),
//               ),

//               m("button", { onclick: Quiz.checkAnswer }, "Check Answer"),
//               m("div.feedback", [
//                 Quiz.feedback &&
//                   m("button", { onclick: Quiz.getRandomVerse }, "Next Verse"),
//                 Quiz.feedback,
//                 m(
//                   "button",
//                   {
//                     onclick: () => {
//                       Quiz.totalAnswered = 0;
//                       Quiz.totalCorrect = 0;
//                       Quiz.gospelScores = {
//                         Matthew: 0,
//                         Mark: 0,
//                         Luke: 0,
//                         John: 0,
//                       };
//                       localStorage.removeItem("gospelScores");
//                     },
//                   },
//                   "Start afresh",
//                 ),
//               ]),
//             ]),
//         ]),
//       ]),
//     ];
//   },
// };

// export default Quiz;
