import m from "mithril";

// const NavButton = {
//   view: function (attrs) {
//     return m("a", { href: `#!${attrs.path}` }, attrs.icon, attrs.label);
//   },
// };

var Menu = {
  view: function () {
    return m("nav.menu", [
      m(m.route.Link, { href: "/" }, "Home"),
      m(m.route.Link, { href: "/about" }, "About"),

      m(m.route.Link, { href: "/quiz" }, "Quiz"),
    ]);
    // return m("nav", [
    //   m(NavButton, { path: "/", icon: "🏠", label: "Home" }),
    //   m(NavButton, { path: "/about", icon: "ℹ️", label: "About" }),
    //   m(NavButton, { path: "/contact", icon: "📞", label: "Contact" }),
    // ]);
  },
};

export default Menu;
