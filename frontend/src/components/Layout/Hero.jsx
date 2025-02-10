import { Link } from "react-router";
import heroImg from "../../assets/rabbit-hero.webp";
export default function Hero() {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="Bazzar"
        className="h-[400px] w-full object-cover md:h-[600px] lg:h-[750px]"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="p-6 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold tracking-tighter uppercase md:text-9xl">
            vacation <br /> Ready
          </h1>
          <p className="mb-6 text-sm tracking-tighter md:text-lg">
            Explore our vacation-ready outfits with fast worldwide shipping.
          </p>
          <Link
            to="#"
            className="rounded-sm bg-white px-6 py-2 text-lg text-gray-950"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
