import { Link } from "react-router";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";
export default function GenderCollectionSection() {
  return (
    <section className="px-4 py-16 lg:px-0">
      <div className="container mx-auto flex flex-col gap-8 md:flex-row">
        {/* Women Collection */}
        <div className="relative flex-1">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="h-[700px] w-full object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Women's Collection
            </h2>
            <Link
              to="/collection/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop now
            </Link>
          </div>
        </div>
        {/* Men Collection */}
        <div className="relative flex-1">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="h-[700px] w-full object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Men&apos;s Collection
            </h2>
            <Link
              to="/collection/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
