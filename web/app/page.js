import LandingPage from "./Components/LandingPage/LandingPage";
import FrequentlySearched from "./Components/FrequentlySearched/FrequentlySearched";
import RecentAdditions from "./Components/RecentAdditions/RecentAdditions";
import Category from "./Components/Category/Category";
import Recommended from "./Components/Recommended/Recommended";
import News from "./Components/News/News";
import Footer from "./Components/Footer/Footer";



export default function Page() {

  return (

    <div>

      <LandingPage />
       <Category />
 
      <FrequentlySearched />
      <RecentAdditions />
      
    
      
      <News />
      
      <Footer />

    </div>

  );

}