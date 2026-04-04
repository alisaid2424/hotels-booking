import { TextAnimate } from "./ui/text-animate";
import { TypingAnimation } from "./ui/typing-animation";

type Props = {
  title: string;
  subTitle: string;
  align?: string;
  font?: string;
};

const Title = ({ title, subTitle, align, font }: Props) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${
        align === "left" && "md:items-start md:text-start"
      }`}
    >
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl md:text-[40px] ${font || "font-playfair"}`}
      >
        <TextAnimate animation="blurInUp" by="character" once>
          {title}
        </TextAnimate>
      </h2>
      <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-lg">
        <TypingAnimation>{subTitle}</TypingAnimation>
      </p>
    </div>
  );
};

export default Title;
