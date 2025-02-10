import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";

export default function TopBar() {
  return (
    <div className="bg-ownred text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="hidden items-center space-x-4 md:flex">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="size-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="size-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="size-4" />
          </a>
        </div>
        <div className="flex-grow text-center text-sm">
          <span>We ship worldwide - Fast and reliable shipping!</span>
        </div>
        <div className="hidden text-sm md:block">
          <a href="tel:+1234567890" className="hover:text-gray-300">
            +1 (234) 567-890
          </a>
        </div>
      </div>
    </div>
  );
}
