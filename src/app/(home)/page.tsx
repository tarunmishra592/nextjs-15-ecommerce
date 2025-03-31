import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import { HomeCarousel } from "@/components/shared/home/home-carousal";
import { HomeCard } from "@/components/shared/home/HomeCard";
import ProductSlider from "@/components/shared/product/product-slider";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCategory, getProductByTag, getProductForCard } from "@/lib/actions/product.actions";
import { HomeBanner } from "@/lib/banner";
import { toSlug } from "@/lib/utils";

export default async function Home() {

  const categories = (await getAllCategory()).slice(0, 4)

  const newArrivals = await getProductForCard({tag: 'new-arrival', limit: 4})

  const featureds = await getProductForCard({tag: 'featured', limit: 4})

  const bestSellers = await getProductForCard({tag: 'best-seller', limit: 4})

  const todaysDeals = await getProductByTag({tag: 'todays-deal'})

  const bestSellingProducts = await getProductByTag({tag: 'best-seller'})


  const cards = [
    {
      title: 'Categories to explore',
      link: {
        text: 'See More',
        href: '/product',
      },
      items: categories.map((category) => ({
        name: category,
        image: `/products/${toSlug(category)}.jpg`,
        href: `/product?category=${category}`,
      })),
    },
    {
      title: 'Explore New Arrivals',
      items: newArrivals,
      link: {
        text: 'View All',
        href: '/product?tag=new-arrival',
      },
    },
    {
      title: 'Discover Best Sellers',
      items: bestSellers,
      link: {
        text: 'View All',
        href: '/product?tag=new-arrival',
      },
    },
    {
      title: 'Featured Products',
      items: featureds,
      link: {
        text: 'Shop Now',
        href: '/product?tag=new-arrivals',
      },
    },
  ]

  return (
    <div>
      <HomeCarousel items={HomeBanner} />
      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCard cards={cards} />
        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider title="Today's deal" products={todaysDeals} />
          </CardContent>
        </Card>

        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider title="Best Selling Products" products={bestSellingProducts} />
          </CardContent>
        </Card>

        <div className="p-3 bg-background">
          <BrowsingHistoryList/>
        </div>
      </div>
    </div>
  );
}
