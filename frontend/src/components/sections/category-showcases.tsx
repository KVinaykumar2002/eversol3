'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Product {
  name: string;
  coopPrice: string;
  imageUrl: string;
  href: string;
}

interface Category {
  title: string;
  products: Product[];
}

const categoriesData: Category[] = [
  {
    title: 'Millets',
    products: [
      {
        name: 'Organic Foxtail Millet (Navane)',
        coopPrice: '93.50',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
        href: '#',
      },
      {
        name: 'Organic Little Millet (Saame)',
        coopPrice: '91.80',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
        href: '#',
      },
      {
        name: 'Organic Finger Millet (Ragi)',
        coopPrice: '97.75',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
        href: '#',
      },
    ],
  },
  {
    title: 'Edible Oils',
    products: [
      {
        name: 'Cold Pressed - Groundnut Oil',
        coopPrice: '419.90',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
        href: '#',
      },
      {
        name: 'Sunflower Oil - Cold Pressed',
        coopPrice: '386.75',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
        href: '#',
      },
      {
        name: 'Cold Pressed - Coconut Oil',
        coopPrice: '93.50',
        imageUrl: 'https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=200&h=200&fit=crop',
        href: '#',
      },
    ],
  },
  {
    title: 'Seeds',
    products: [
      {
        name: 'Organic Pumpkin Seed',
        coopPrice: '112.20',
        imageUrl: 'https://images.unsplash.com/photo-1606914501446-0c2c0c0a0c0c?w=200&h=200&fit=crop',
        href: '#',
      },
      {
        name: 'Organic White Sesame',
        coopPrice: '68.80',
        imageUrl: 'https://images.unsplash.com/photo-1606914501446-0c2c0c0a0c0c?w=200&h=200&fit=crop',
        href: '#',
      },
      {
        name: 'Organic Sunflower Seeds',
        coopPrice: '72.25',
        imageUrl: 'https://images.unsplash.com/photo-1606914501446-0c2c0c0a0c0c?w=200&h=200&fit=crop',
        href: '#',
      },
    ],
  },
  {
    title: 'Pulses',
    products: [
      {
        name: 'Organic Tur/Toor Dal',
        coopPrice: '154.70',
        imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop',
        href: '#',
      },
      {
        name: 'Organic Groundnuts',
        coopPrice: '157.25',
        imageUrl: 'https://images.unsplash.com/photo-1606914501446-0c2c0c0a0c0c?w=200&h=200&fit=crop',
        href: '#',
      },
      {
        name: 'Organic Moong Dal',
        coopPrice: '137.70',
        imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop',
        href: '#',
      },
    ],
  },
];

const CategoryShowcases = () => {
  return (
    <section className="bg-white py-14">
      <div className="container mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {categoriesData.map((category, index) => (
            <div
              key={category.title}
              className={`p-6 border-border-gray-alt ${
                index > 0 ? 'border-t' : ''
              } md:border-t-0 ${index >= 2 ? 'md:border-t' : ''} ${
                index % 2 !== 0 ? 'md:border-l' : ''
              } lg:border-t-0 ${index > 0 ? 'lg:border-l' : ''}`}
            >
              <h4 className="font-display text-xl font-semibold text-dark-gray-alt mb-6 pb-2 border-b-2 border-primary-green inline-block">
                {category.title}
              </h4>
              <div className="space-y-6">
                {category.products.map(product => (
                  <div key={product.name} className="flex items-center space-x-4 group">
                    <Link href={product.href} className="flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-md bg-white shadow-sm ring-1 ring-border-gray-alt transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
                      />
                    </Link>
                    <div>
                      <Link href={product.href} className="no-underline">
                        <p className="font-body text-sm font-medium text-dark-gray-alt hover:text-primary-green leading-tight transition-colors">
                          {product.name}
                        </p>
                      </Link>
                      <p className="text-sm mt-1">
                        <span className="font-semibold text-success-green">₹{product.coopPrice}</span>
                        <span className="text-xs text-medium-gray-alt ml-1"> for Co-Op Members*</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcases;