"use client";

import LandingPage from "./Components/LandingPage/LandingPage";
import FrequentlySearched from "./Components/FrequentlySearched/FrequentlySearched";
import RecentAdditions from "./Components/RecentAdditions/RecentAdditions";
import Category from "./Components/Category/Category";
import News from "./Components/News/News";
import Feedback from "./Components/Feedback/Feedback";
import PopupFeedback from "./Components/Feedback/PopupFeedback";
import Footer from "./Components/Footer/Footer";
import ReportsSection from "./Components/Reports/Reports";
import ThesisPapersSection from "./Components/ThesisPapers/ThesisPapers";
import { useEffect } from "react";

export default function Page() {

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      <LandingPage />

      <div id="recent-additions">
        <RecentAdditions />
      </div>

      <div id="frequently-searched">
        <FrequentlySearched />
      </div>

      <div id="thesis-papers">
        <ThesisPapersSection />
      </div>

      <div id="reports">
        <ReportsSection />
        <Category />
      </div>

      <div id="news">
        <News />
      </div>

      <Feedback />
      <Footer />

      <PopupFeedback />
    </div>
  );
}