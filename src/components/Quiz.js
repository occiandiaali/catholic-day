// import m from "mithril";
// import Menu from "./Menu";

// var Quiz = {
//   gospelName: "Matthew",
//   randomVerse: "",
//   blankedVerse: "",
//   correctAnswer: "",
//   userAnswer: "",
//   loading: false,
//   feedback: "",

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

//   setGospelName: function (value) {
//     Quiz.gospelName = value;
//   },

//   getRandomVerse: function () {
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
//     Quiz.correctAnswer = "";
//     Quiz.userAnswer = "";

//     m.request({
//       method: "GET",
//       url: `https://bible-api.com/${gospel}+${randomChapter}:${randomVerse}`,
//     }).then(function (result) {
//       Quiz.loading = false;
//       if (result && result.text) {
//         Quiz.randomVerse = `${result.reference}: ${result.text}`;

//         // Create fill-in-the-blank version
//         const words = result.text.split(" ");
//         const blankIndex = Math.floor(Math.random() * words.length);
//         Quiz.correctAnswer = words[blankIndex].replace(/[^a-zA-Z]/g, ""); // strip punctuation
//         words[blankIndex] = "_____";
//         Quiz.blankedVerse = `${result.reference}: ${words.join(" ")}`;
//       } else {
//         Quiz.randomVerse = "Could not fetch verse.";
//       }
//       m.redraw();
//     });
//   },

//   checkAnswer: function () {
//     if (
//       Quiz.userAnswer.trim().toLowerCase() ===
//       Quiz.correctAnswer.trim().toLowerCase()
//     ) {
//       Quiz.feedback = "✅ Correct!";
//       if (window.confetti) {
//         window.confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 },
//         });
//       }
//     } else {
//       Quiz.feedback = `❌ Wrong. The correct word was "${Quiz.correctAnswer}".`;
//     }
//   },

//   view: function () {
//     return [
//       m(Menu),
//       m("div.main", [
//         m("h1", "📌Test your catechism"),
//         m("div", [
//           m("form", [
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
//           m("p.termsP", "You've chosen: " + Quiz.gospelName),
//           m(
//             "button",
//             {
//               onclick: Quiz.getRandomVerse,
//               disabled: Quiz.loading,
//             },
//             Quiz.loading ? "Loading..." : "Get Random Verse",
//           ),

//           Quiz.blankedVerse &&
//             m("div.quizSection", [
//               m("p.termsP", "Fill in the missing word:"),
//               // m("p.blankedVerse", Quiz.blankedVerse),
//               m("p.termsP", Quiz.blankedVerse),
//               m("input[type=text][name=answer]", {
//                 placeholder: "Enter missing word",
//                 value: Quiz.userAnswer,
//                 oninput: (e) => (Quiz.userAnswer = e.target.value),
//               }),
//               m("button", { onclick: Quiz.checkAnswer }, "Submit Answer"),
//               //m("p.feedback", Quiz.feedback),
//               m("p.termsP", Quiz.feedback),
//             ]),
//         ]),
//       ]),
//     ];
//   },
// };

// export default Quiz;

//************************************* */

// import m from "mithril";
// import Menu from "./Menu";

// // Confetti CDN (include in index.html):
// // <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

// var Quiz = {
//   gospelName: "Matthew",
//   randomVerse: "",
//   blankedVerse: "",
//   correctAnswers: [],
//   userAnswer: "",
//   loading: false,
//   feedback: "",
//   level: 1, // default difficulty

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

//   setGospelName(value) {
//     Quiz.gospelName = value;
//   },

//   setLevel(value) {
//     Quiz.level = parseInt(value, 10);
//   },

//   getRandomVerse() {
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
//     Quiz.userAnswer = "";

//     m.request({
//       method: "GET",
//       url: `https://bible-api.com/${gospel}+${randomChapter}:${randomVerse}`,
//     }).then(function (result) {
//       Quiz.loading = false;
//       if (result && result.text) {
//         Quiz.randomVerse = `${result.reference}: ${result.text}`;

//         // Create fill-in-the-blank version with hints
//         const words = result.text.split(" ");
//         const blankIndices = [];
//         while (blankIndices.length < Quiz.level) {
//           const idx = Math.floor(Math.random() * words.length);
//           if (!blankIndices.includes(idx)) blankIndices.push(idx);
//         }

//         Quiz.correctAnswers = blankIndices.map((i) =>
//           words[i].replace(/[^a-zA-Z]/g, ""),
//         );

//         blankIndices.forEach((i, idx) => {
//           const original = Quiz.correctAnswers[idx];
//           const firstLetter = original.charAt(0);
//           const hint = `${firstLetter}${"_".repeat(Math.max(original.length - 1, 3))}`;
//           words[i] = hint; // Replace with hint
//         });

//         Quiz.blankedVerse = `${result.reference}: ${words.join(" ")}`;
//       } else {
//         Quiz.randomVerse = "Could not fetch verse.";
//       }
//       m.redraw();
//     });
//   },

//   checkAnswer() {
//     const userWords = Quiz.userAnswer.trim().split(/\s+/);
//     const correct = Quiz.correctAnswers.map((w) => w.toLowerCase());
//     const user = userWords.map((w) => w.toLowerCase());

//     if (JSON.stringify(correct) === JSON.stringify(user)) {
//       Quiz.feedback = "✅ Correct!";
//       if (window.confetti) {
//         window.confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 },
//         });
//       }
//     } else {
//       Quiz.feedback =
//         "❌ Wrong. The correct words were: " + Quiz.correctAnswers.join(", ");
//     }
//   },

//   view() {
//     return [
//       m(Menu),
//       m("div.main", [
//         m("h1", "📌Test your catechism"),
//         m("div", [
//           // Gospel selector
//           m("form", [
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
//           m("p.termsP", "You've chosen: " + Quiz.gospelName),

//           // Level selector
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

//           // Get verse button
//           m(
//             "button",
//             {
//               onclick: Quiz.getRandomVerse,
//               disabled: Quiz.loading,
//             },
//             Quiz.loading ? "Loading..." : "Get Random Verse",
//           ),

//           // Quiz section
//           Quiz.blankedVerse &&
//             m("div.quizSection", [
//               m("p.termsP", "Fill in the missing word(s):"),
//               //m("p.blankedVerse", Quiz.blankedVerse),
//               m("p.termsP", Quiz.blankedVerse),
//               m("input[type=text][name=answer].inputWithSpaces", {
//                 placeholder: "Enter missing word(s) separated by spaces",
//                 value: Quiz.userAnswer,
//                 oninput: (e) => (Quiz.userAnswer = e.target.value),
//               }),
//               m("button", { onclick: Quiz.checkAnswer }, "Submit Answer"),
//               //m("p.feedback", Quiz.feedback),
//               m("p.termsP", Quiz.feedback),
//             ]),
//         ]),
//       ]),
//     ];
//   },
// };

// export default Quiz;

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

import m from "mithril";
import Menu from "./Menu";

// Confetti CDN (include in index.html):
// <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

var Quiz = {
  gospelName: "Matthew",
  randomVerse: "",
  blankedVerse: "",
  correctAnswers: [],
  blankIndices: [],
  originalWords: [],
  userAnswer: "",
  loading: false,
  feedback: "",
  level: 1, // default difficulty
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
    // For client-side rate limiting
    if (Quiz.cooldown) return; // prevent if cooldown active

    Quiz.cooldown = true;
    setTimeout(() => {
      Quiz.cooldown = false;
    }, 5000); // 5s cooldown

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
    Quiz.userAnswer = "";

    m.request({
      method: "GET",
      url: `https://bible-api.com/${gospel}+${randomChapter}:${randomVerse}`,
    }).then(function (result) {
      Quiz.loading = false;
      if (result && result.text) {
        Quiz.randomVerse = `${result.reference}: ${result.text}`;

        // Store original words for reconstruction
        const words = result.text.split(" ");
        Quiz.originalWords = words.slice();

        // Create fill-in-the-blank version with hints
        const blankIndices = [];
        while (blankIndices.length < Quiz.level) {
          const idx = Math.floor(Math.random() * words.length);
          if (!blankIndices.includes(idx)) blankIndices.push(idx);
        }

        Quiz.correctAnswers = blankIndices.map((i) =>
          words[i].replace(/[^a-zA-Z]/g, ""),
        );
        Quiz.blankIndices = blankIndices;

        blankIndices.forEach((i, idx) => {
          const original = Quiz.correctAnswers[idx];
          const firstLetter = original.charAt(0);
          const hint = `${firstLetter}${"_".repeat(Math.max(original.length - 1, 3))}`;
          words[i] = hint; // Replace with hint
        });

        Quiz.blankedVerse = `${result.reference}: ${words.join(" ")}`;
      } else {
        Quiz.randomVerse = "Could not fetch verse.";
      }
      m.redraw();
    });
  },

  checkAnswer() {
    const userWords = Quiz.userAnswer.trim().split(/\s+/);
    const correct = Quiz.correctAnswers.map((w) => w.toLowerCase());
    const user = userWords.map((w) => w.toLowerCase());

    let allCorrect = true;
    let results = [];

    correct.forEach((c, idx) => {
      if (user[idx] === c) {
        results.push("✅ " + Quiz.correctAnswers[idx]);
      } else {
        results.push("❌ " + Quiz.correctAnswers[idx]);
        allCorrect = false;
      }
    });

    if (allCorrect) {
      Quiz.feedback = "✅ Correct!";
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      // Rebuild the verse using original words
      const reconstructed = Quiz.originalWords.slice();
      Quiz.blankIndices.forEach((i, idx) => {
        reconstructed[i] = Quiz.correctAnswers[idx];
      });

      Quiz.feedback =
        "❌ Some answers were wrong.\n" +
        "Results: " +
        results.join(", ") +
        "\n\n" +
        "\nThe correct verse is: " +
        Quiz.randomVerse.split(":")[0] +
        ": " +
        reconstructed.join(" ");
    }
  },

  view() {
    return [
      m(Menu),
      m("div.main", [
        m("h1.header", "📌 Test your catechism"),
        m("div", [
          // Gospel selector
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
          m("p.termsP", "You've chosen: " + Quiz.gospelName),

          // Level selector
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

          // Get verse button
          m(
            "button",
            {
              onclick: Quiz.getRandomVerse,
              disabled: Quiz.loading || Quiz.cooldown,
            },
            Quiz.loading ? "Loading..." : "Get Random Verse",
          ),

          // Quiz section
          Quiz.blankedVerse &&
            m("div.quizSection", [
              m("p.termsP", "Fill in the missing word(s):"),
              //m("p.blankedVerse", Quiz.blankedVerse),
              m("p.termsP", Quiz.blankedVerse),
              m("input[type=text][name=answer].inputWithSpaces", {
                placeholder: "Enter missing word(s) with spaces",
                value: Quiz.userAnswer,
                oninput: (e) => (Quiz.userAnswer = e.target.value),
              }),
              m("button", { onclick: Quiz.checkAnswer }, "Check Answer"),
              //m("pre.feedback", Quiz.feedback), // use <pre> to preserve line breaks
              m("p.termsP", Quiz.feedback), // using <pre> to preserve line breaks
            ]),
        ]),
      ]),
    ];
  },
};

export default Quiz;
