import PrivacyTerms from "../Components/PrivacyTerms/PrivacyTerms";
import Nav from "../Components/Nav/Nav";
import Footer from "../Components/Footer/Footer";

export const metadata = {
  title: "Privacy & Terms - LMIS",
  description: "View our Privacy Policy and Terms of Service",
};

export default function PrivacyTermsPage() {
  return (
    <div>
      <Nav />
      <PrivacyTerms />
      <Footer />
    </div>
  );
}