import m from "mithril";
import Menu from "./Menu";

var TubeCube = {
  view: function () {
    return [
      m(Menu),
      m("div.main.tube", [m("h1", "TubeCube"), m("P", "YouTube videos")]),
    ];
  },
};

export default TubeCube;
