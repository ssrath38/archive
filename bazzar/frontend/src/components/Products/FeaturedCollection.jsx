import { Link } from "react-router";
import featured from "../../assets/featured.webp";

export default function FeaturedCollection() {
  return (
    <section className="px-4 py-16 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse items-center rounded-3xl bg-green-50 lg:flex-row">
        {/* Left Content */}
        <div className="p-8 text-center lg:w-1/2 lg:text-left">
          <h2 className="nb-2 text-lg font-semibold text-gray-700">
            Comfort and Style
          </h2>
          <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
            Apparel made for your everyday life
          </h2>
          <p className="mb-6 text-lg text-gray-600">
            Discover hihg-quality, comfortable clothing that effortlessly blends
            fashion and function. Designed to make you look and feel great
            everyday.
          </p>
          <Link
            to="/collections/all"
            className="rounded-lg bg-black px-6 py-3 text-lg text-white hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
        {/* Right Content */}
        <div className="lg:w-1/2">
          <img
            src={featured}
            alt="Featured Collection"
            className="h-full w-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  );
}
