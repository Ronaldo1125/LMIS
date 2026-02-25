import LandingPage from "./Components/LandingPage/LandingPage";
import FrequentlySearched from "./Components/FrequentlySearched/FrequentlySearched";
import RecentAdditions from "./Components/RecentAdditions/RecentAdditions";
import Category from "./Components/Category/Category";
import News from "./Components/News/News";
import AboutLibrary from "./Components/AboutLibrary/AboutLibrary";
import Footer from "./Components/Footer/Footer";


export default function Page() {

  return (

    <div>


      <LandingPage />
       <Category />
 
      <FrequentlySearched />
      <RecentAdditions />
      
    
      
      <AboutLibrary />
      
      <News />
      
      <Footer />

    </div>

  );

}