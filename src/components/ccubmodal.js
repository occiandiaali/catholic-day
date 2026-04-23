import m from "mithril";

// const CcubModal = {
//   view: ({ attrs }) => [
//     m(
//       "div.ccmodal",
//       m("iframe", {
//         src: attrs.url,
//         style: { width: "100%", height: "60%", border: "none" },
//       }),
//       m("button.closeCcModal", { onclick: attrs.onClose }, "&times;"),

//     ),
//   ],
// };
const CcubModal = {
  view: ({ attrs }) =>
    m("div.modal", [
      m("div.modal-content", [
        m("button.close", { onclick: attrs.onClose }, "Close"),
        m("h2", "Readings"),

        m("pre.reading-text", attrs.readingText || "No reading available"),
      ]),
    ]),
};

export default CcubModal;
