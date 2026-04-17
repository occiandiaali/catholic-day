import m from "mithril";
import Menu from "./Menu";

var Terms = {
  view: function () {
    return [
      m(Menu),
      m("div.main", [
        m("h1", "Terms"),
        m("p.termsP", [
          `
If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.

Information Collection and Use

We take and respect your privacy seriously. We may collect information via cookie or web log. This is to customize services and enhance customer satisfaction. The data we collect are:

Log Data

We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.

Cookies and Third Party Advertising

Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer's hard drive. Our website uses these "cookies" to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service. We allow third-party companies to serve ads and/or collect certain anonymous information when you visit our web site. These companies may use non-personally identifiable information (e.g., click stream information, browser type, time and date, subject of advertisements clicked or scrolled over) during your visits to this and other Web sites in order to provide advertisements about goods and services likely to be of greater interest to you. These companies typically use a cookie or third party web beacon to collect this information. To learn more about this behavioral advertising practice, you can visit       
        `,
          m(
            "a.termsA",
            {
              href: "https://www.microsoft.com/en-us/edge/learning-center/what-are-cookies?form=MA13I2",
              target: "_blank",
              rel: "noopener",
            },
            "What are cookies?",
          ),
        ]),
      ]),
    ];
  },
};

export default Terms;
