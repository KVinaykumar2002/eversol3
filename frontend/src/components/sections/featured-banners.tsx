import Image from 'next/image';
import Link from 'next/link';

interface BannerCardProps {
  title: string;
  imageUrl: string;
  href: string;
}

const banners: BannerCardProps[] = [
  {
    title: "Natural, chemical-free cereals to start your day the organic way",
    imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/cereals_banner-26.jpg",
    href: "#"
  },
  {
    title: "Fuel your day with premium quality dry fruits and seeds",
    imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/dry_fruites_banner-27.jpg",
    href: "#"
  },
  {
    title: "Organic, cold pressed cooking oils to nourish your health",
    imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/Oils_banner-28.jpg",
    href: "#"
  }
];

const BannerCard = ({ title, imageUrl, href }: BannerCardProps) => (
  <Link href={href} className="group relative block overflow-hidden rounded-lg aspect-w-4 aspect-h-3">
    <Image
      src={imageUrl}
      alt={title}
      fill
      className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="absolute bottom-0 left-0 p-6">
      <h4 className="font-semibold text-white text-xl leading-snug">
        {title}
      </h4>
    </div>
  </Link>
);

const FeaturedBanners = () => {
  return (
    <section className="bg-background">
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <BannerCard key={banner.title} {...banner} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBanners;