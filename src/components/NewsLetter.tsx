import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Title from "./Title";
import Motion from "./Motion";

const NewsLetter = () => {
  return (
    <Motion className="flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-32 bg-gray-900 text-white">
      <Title
        title="Stay Inspired"
        subTitle="Join our newsLetter and be the first to discover new distinations, exclusive offers, and travel inspiration."
      />

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
        <input
          type="text"
          className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full"
          placeholder="Enter your email"
        />
        <Button className="group py-6 active:scale-95 transition-all">
          Subscribe
          <ArrowRight className="group-hover:translate-x-1 w-4 h-4 transition" />
        </Button>
      </div>
      <p className="text-gray-500 mt-6 text-xs text-center">
        By subscribing, you agree to our Privacy Policy and consent to receive
        updates.
      </p>
    </Motion>
  );
};

export default NewsLetter;
