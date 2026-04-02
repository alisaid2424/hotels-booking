import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Users, Star, Globe, ArrowRight } from "lucide-react";
import Image from "next/image";

const stats = [
  { icon: Award, value: "25+", label: "Years" },
  { icon: Users, value: "50K+", label: "Guests" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Globe, value: "42", label: "Countries" },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-background text-foreground grid lg:grid-cols-2 overflow-hidden pt-24">
      {/* LEFT — Content */}
      <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-10">
        <Badge
          variant="secondary"
          className="w-fit mb-5 px-3 py-1 text-[11px] tracking-widest uppercase font-semibold"
        >
          ✦ About Hotel Booking
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight tracking-tight mb-4">
          Where Every Stay <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Becomes a Memory
          </span>
        </h1>

        <p className="text-muted-foreground text-base leading-relaxed max-w-md mb-8">
          Founded in 1999, we connect discerning guests with the world&apos;s
          finest hotels across 42 countries. Every property is hand-picked for
          exceptional quality and unforgettable experiences.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="bg-primary/10 rounded-xl p-3 text-center"
            >
              <Icon
                className="w-4 h-4 text-primary mx-auto mb-1.5"
                strokeWidth={2}
              />
              <p className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-none">
                {value}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity gap-2 font-semibold h-11 px-6 border-0">
            Explore Hotels <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="h-11 px-6 font-semibold">
            Contact Us
          </Button>
        </div>
      </div>

      {/* RIGHT — Images */}
      <div className="relative hidden lg:flex items-center justify-center bg-muted/20 overflow-hidden">
        <div className="relative w-full max-w-sm h-[75vh]">
          {/* Main image */}
          <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
              alt="Luxury hotel lobby"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Floating card — bottom left */}
          <div className="absolute -bottom-1 -left-10 bg-background border border-border/60 rounded-xl shadow-xl p-3.5 flex items-center gap-3 w-44">
            <div className="bg-primary/10 w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-primary" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Since 1999
              </p>
              <p className="text-[10px] text-muted-foreground">
                25 years of trust
              </p>
            </div>
          </div>

          {/* Floating card — top right */}
          <div className="absolute -top-1 -right-6 bg-background border border-border/60 rounded-xl shadow-xl p-3.5 text-center w-28">
            <p className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              4.9
            </p>
            <div className="flex justify-center gap-0.5 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">50K+ Reviews</p>
          </div>
        </div>

        {/* Small corner image */}
        <div className="absolute bottom-8 right-4 w-28 h-36 rounded-xl overflow-hidden shadow-xl border-2 border-background">
          <Image
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80"
            alt="Hotel pool"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
