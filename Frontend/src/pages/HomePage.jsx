import HeroSection from '../components/home/HeroSection';
import BrandStory from '../components/home/BrandStory';
import FeaturedCollections from '../components/home/FeaturedCollections';
import BestSellers from '../components/home/BestSellers';
import TeaCulture from '../components/home/TeaCulture';
import SubscriptionSection from '../components/home/SubscriptionSection';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandStory />
      <FeaturedCollections />
      <BestSellers />
      <TeaCulture />
      <SubscriptionSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}
