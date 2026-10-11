import HeroSection from '../components/home/HeroSection';
import BrandStory from '../components/home/BrandStory';
import FeaturedCollections from '../components/home/FeaturedCollections';
import BestSellers from '../components/home/BestSellers';
import TeaCulture from '../components/home/TeaCulture';
import SubscriptionSection from '../components/home/SubscriptionSection';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import { useEffect, useState } from 'react';
import { siteContentAPI } from '../services/api';
import TeaFinder from '../components/home/TeaFinder';
import {
  BrewingGuides,
  CustomerReviews,
  CustomerTrust,
  GiftCollections,
  HomepageFAQ,
  NewArrivals,
  ShopByCategory,
  ShopByMood,
  TrustBenefits,
} from '../components/home/DiscoverySections';

const sectionComponents = {
  hero: HeroSection,
  benefits: TrustBenefits,
  categories: ShopByCategory,
  brandStory: BrandStory,
  collections: FeaturedCollections,
  bestSellers: BestSellers,
  newArrivals: NewArrivals,
  moods: ShopByMood,
  gifts: GiftCollections,
  customerReviews: CustomerReviews,
  culture: TeaCulture,
  brewingGuides: BrewingGuides,
  subscriptions: SubscriptionSection,
  testimonials: Testimonials,
  faq: HomepageFAQ,
  customerTrust: CustomerTrust,
  newsletter: Newsletter,
  teaFinder: TeaFinder,
};
const defaultOrder = ['hero', 'benefits', 'categories', 'collections', 'bestSellers', 'newArrivals', 'teaFinder', 'moods', 'brandStory', 'gifts', 'customerReviews', 'culture', 'brewingGuides', 'subscriptions', 'testimonials', 'faq', 'customerTrust', 'newsletter'];
const defaultSections = defaultOrder.map((key, sortOrder) => ({ key, sortOrder, enabled: true, settings: {} }));

export default function HomePage() {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    let active = true;
    siteContentAPI.getHomepage().then(({ data }) => {
      if (active && data?.data) setConfig(data.data);
    }).catch(() => {}).finally(() => {});
    return () => { active = false; };
  }, []);
  const publishedSections = Array.isArray(config?.sections) ? config.sections : [];
  const publishedKeys = new Set();
  const configured = publishedSections.filter((section) => sectionComponents[section.key] && !publishedKeys.has(section.key) && publishedKeys.add(section.key));
  const maxOrder = configured.reduce((max, section) => Math.max(max, Number(section.sortOrder) || 0), -1);
  const appendedDefaults = defaultSections.filter((section) => !publishedKeys.has(section.key)).map((section, index) => ({ ...section, sortOrder: maxOrder + index + 1 }));
  const sections = [...configured, ...appendedDefaults]
    .filter((section) => section.enabled && sectionComponents[section.key])
    .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));
  return (
    <>
      {sections.map((section) => {
        const Component = sectionComponents[section.key];
        return <Component key={section.key} content={section.settings || {}} />;
      })}
    </>
  );
}
