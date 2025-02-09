// pages/MainPage.jsx
import Header from '../components/layout/Header';
import Footer from '../components/layout/footer';
import SearchHero from '../components/layout/SearchHero';
import Communities from '../components/section/Communities';
import RecentlyAdded from '../components/section/RecentlyAdded';
import Browse from '../components/section/Browse';
import Discover from '../components/section/Discover';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SearchHero />
      
      {/* Dividing Line */}
      <div className="border-t border-border my-6 opacity-20" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side Content */}
          <div className="md:w-3/4 space-y-6">
            <Communities />
            <RecentlyAdded />
          </div>

          {/* Vertical Dividing Line */}
          <div className="hidden md:block border-l border-border opacity-25" />

          {/* Right Side Content */}
          <div className="md:w-1/4 space-y-6">
            <Browse />
            <Discover />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}