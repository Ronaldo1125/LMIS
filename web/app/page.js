import LandingPage from "./Components/LandingPage/LandingPage";
import FrequentlySearched from "./Components/FrequentlySearched/FrequentlySearched";
import RecentAdditions from "./Components/RecentAdditions/RecentAdditions";
import Category from "./Components/Category/Category";
import News from "./Components/News/News";
import AboutLibrary from "./Components/Auth/AboutLibrary/AboutLibrary";
import Footer from "./Components/Footer/Footer";
import FreeAccess from "./Components/FreeAccess/FreeAccess";
import ReportsSection from "./Components/Reports/Reports";
import ThesisPapersSection from "./Components/ThesisPapers/ThesisPapers";

export default function Page() {

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

      <Footer />

    </div>

  );

}