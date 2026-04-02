import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-[#F6F9FC] text-gray-500/80 pt-8 padding-x">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        <div className="max-w-80">
          <Image
            src="/logo.svg"
            alt="logo"
            width={150}
            height={150}
            className="mb-4 h-8 md:h-9 invert opacity-80"
            priority
          />

          <p className="text-sm">
            Discover the world&apos;s most extraordinary places to stay, from
            boutique hotels to luxury villas and private islands.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {/* Instagram */}
            <Instagram className="w-6" />
            {/* Facebook */}
            <Facebook className="w-6" />
            {/* Twitter */}
            <Twitter className="w-6" />
            {/* LinkedIn */}
            <Linkedin className="w-6" />
          </div>
        </div>

        <div>
          <p className="font-playfair text-lg text-gray-800">COMPANY</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link href="#">About</Link>
            </li>
            <li>
              <Link href="#">Careers</Link>
            </li>
            <li>
              <Link href="#">Press</Link>
            </li>
            <li>
              <Link href="#">Blog</Link>
            </li>
            <li>
              <Link href="#">Partners</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-playfair text-lg text-gray-800">SUPPORT</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link href="#">Help Center</Link>
            </li>
            <li>
              <Link href="#">Safety Information</Link>
            </li>
            <li>
              <Link href="#">Cancellation Options</Link>
            </li>
            <li>
              <Link href="#">Contact Us</Link>
            </li>
            <li>
              <Link href="#">Accessibility</Link>
            </li>
          </ul>
        </div>

        <div className="max-w-80">
          <p className="font-playfair text-lg text-gray-800">STAY UPDATED</p>
          <p className="mt-3 text-sm">
            Subscribe to our newsletter for inspiration and special offers.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none"
              placeholder="Your email"
            />
            <button className="group flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r">
              <ArrowRight className="group-hover:translate-x-1 w-4 h-4 transition" />
            </button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300 mt-8" />
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>
          © {new Date().getFullYear()} <Link href="#">ElasyStay</Link>. All
          rights reserved.
        </p>
        <ul className="flex items-center gap-4">
          <li>
            <Link href="#">Privacy</Link>
          </li>
          <li>
            <Link href="#">Terms</Link>
          </li>
          <li>
            <Link href="#">Sitemap</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
