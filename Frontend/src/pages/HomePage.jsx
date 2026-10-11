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

const sectionComponents = {
  hero: HeroSection,
  brandStory: BrandStory,
  collections: FeaturedCollections,
  bestSellers: BestSellers,
  culture: TeaCulture,
  subscriptions: SubscriptionSection,
  testimonials: Testimonials,
  newsletter: Newsletter,
  teaFinder: TeaFinder,
};
const defaultSections = Object.keys(sectionComponents).map((key, sortOrder) => ({ key, sortOrder, enabled: key !== 'teaFinder' }));

export default function HomePage() {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    let active = true;
    siteContentAPI.getHomepage().then(({ data }) => {
      if (active && data?.data) setConfig(data.data);
    }).catch(() => {}).finally(() => {});
    return () => { active = false; };
  }, []);
  const sections = (config?.sections || defaultSections)
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
