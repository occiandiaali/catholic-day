import m from "mithril";
import Menu from "./Menu";
//import CcubModal from "./ccubmodal";

var Home = {
  outcome: {},
  readings: {},
  usccbLink: "",
  currentDate: new Date(), // start with today
  // showCcModal: false,
  // readingText: "",

  fetchData: function () {
    var year = Home.currentDate.getFullYear();
    var month = String(Home.currentDate.getMonth() + 1).padStart(2, "0");
    var day = String(Home.currentDate.getDate()).padStart(2, "0");

    var url =
      "https://cpbjr.github.io/catholic-readings-api/liturgical-calendar/" +
      year +
      "/" +
      month +
      "-" +
      day +
      ".json";

    m.request({
      method: "GET",
      url: url,
    }).then(function (result) {
      Home.outcome = result;
      Home.fetchReadings();
    });
  },

  // Fetch readings data
  fetchReadings: function () {
    var year = Home.currentDate.getFullYear();
    var month = String(Home.currentDate.getMonth() + 1).padStart(2, "0");
    var day = String(Home.currentDate.getDate()).padStart(2, "0");

    var url =
      "https://cpbjr.github.io/catholic-readings-api/readings/" +
      year +
      "/" +
      month +
      "-" +
      day +
      ".json";

    m.request({ method: "GET", url: url }).then(function (result) {
      Home.readings = result.readings;
      Home.usccbLink = result.usccbLink;
    });
  },

  oninit: function () {
    Home.fetchData();
  },

  view: function () {
    return [
      m(Menu),
      m("div.main", [
        m("div.h1AndSvgDiv", [
          m("img[src='/saint-patrick.svg'].stPatSvg"),
          m("h1", "Welcome to Catholic Day"),
        ]),

        Home.outcome.date
          ? m("p.whiteP", "Date: " + Home.outcome.date)
          : m("p.whiteP", "Loading..."),

        Home.outcome.season
          ? m("p.whiteP", "Season: " + Home.outcome.season)
          : null,

        Home.outcome.celebration
          ? m("p.whiteP", "Celebration: " + Home.outcome.celebration.name)
          : null,

        Home.outcome.celebration
          ? m("p.whiteP", "Type: " + Home.outcome.celebration.type)
          : null,

        Home.readings.firstReading ||
        Home.readings.psalm ||
        Home.readings.gospel
          ? m("div.readings", [
              m("h2", "Daily Readings"),

              Home.readings.firstReading
                ? m("p", "First Reading: " + Home.readings.firstReading)
                : null,

              Home.readings.psalm
                ? m("p", "Psalm: " + Home.readings.psalm)
                : null,

              Home.readings.gospel
                ? m("p", "Gospel: " + Home.readings.gospel)
                : null,

              Home.usccbLink
                ? m("p", [
                    "Full Readings: ",
                    m(
                      "a",
                      {
                        href: Home.usccbLink,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      },
                      "View in USCCB website",
                      m("span", { style: { fontSize: "0.9em" } }, "⧉↗"),
                    ),
                  ])
                : null,
            ])
          : m("div.readings", [
              m("h2", "Daily Readings"),
              m("p", "No readings available for this day."),
            ]),

        // Navigation buttons
        m("div.daynav", [
          m(
            "button.prevDay",
            {
              onclick: function () {
                Home.currentDate.setDate(Home.currentDate.getDate() - 1);
                Home.fetchData();
              },
            },
            "Previous Day",
          ),

          m(
            "button.nextDay",
            {
              onclick: function () {
                Home.currentDate.setDate(Home.currentDate.getDate() + 1);
                Home.fetchData();
              },
            },
            "Next Day",
          ),
        ]),

        // Date picker
        m("div.datepicker", [
          m("label.whiteP", { for: "jumpDate" }, "Jump to Date: "),
          m("input[type=date].jumpDateInput", {
            id: "jumpDate",
            value: Home.currentDate.toISOString().split("T")[0],
            onchange: function (e) {
              Home.currentDate = new Date(e.target.value);
              Home.fetchData();
            },
          }),
        ]),
      ]),
    ];
  },
};

export default Home;
