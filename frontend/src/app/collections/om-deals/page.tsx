import Link from "next/link";
import { Tag, ArrowLeft } from "lucide-react";

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-5 py-16 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center text-primary-green font-semibold mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 mb-6">
              <Tag className="w-12 h-12 text-red-alert" />
            </div>
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              Deals of the Day
            </h1>
            <p className="text-lg text-medium-gray">
              Amazing discounts on organic products - limited time offers
            </p>
          </div>

          <div className="p-8 bg-light-gray rounded-lg">
            <p className="text-medium-gray mb-4">
              Check back soon for amazing deals on organic products!
            </p>
            <Link
              href="/"
              className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
