import Hero from "@/components/hero/hero";
import CategoriesStrip from "@/components/categories-strip/categoriesstrip";
import TrustBadges from "@/components/trust-badges/trustbadges";
import FeaturedProducts from "@/components/featured-products/featuredproducts";
import RecentlyViewed from "@/components/recently-viewed/recentlyviewed";
import WhyUs from "@/components/why-us/whyus";
import Homesection from "@/components/home-section/homesection";

export default function Home() {
  return (
    <div>
      <Hero />
      <CategoriesStrip />
      <TrustBadges />
      <FeaturedProducts />
      <RecentlyViewed />
      <WhyUs />
      <Homesection />
    </div>
  );
}