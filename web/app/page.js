import LandingPage from "./Components/LandingPage/LandingPage";
import FrequentlySearched from "./Components/FrequentlySearched/FrequentlySearched";
import RecentAdditions from "./Components/RecentAdditions/RecentAdditions";
import Category from "./Components/Category/Category";
import News from "./Components/News/News";
import AboutLibrary from "./Components/AboutLibrary/AboutLibrary";
import Footer from "./Components/Footer/Footer";
import FreeAccess from "./Components/FreeAccess/FreeAccess";

export default function Page() {

  return (

    <div className="min-w-[320px]">


      <LandingPage />

     

       <RecentAdditions />
       
 
      <FrequentlySearched />
     
      <Category />
    
      
      
      
      <News />
      
       <FreeAccess />
      <Footer />

    </div>

  );

}