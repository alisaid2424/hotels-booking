import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import ContactForm from "./_components/ContactForm";

const ContactPage = () => {
  return (
    <section className="min-h-[calc(100vh-64px)] mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24 items-start">
        {/* LEFT */}
        <div className="lg:col-span-6 xl:col-span-7">
          <div className="mb-8 space-y-4">
            <Badge className="bg-orange-100 text-orange-600 hover:text-white transition-all">
              Get in Touch
            </Badge>

            <h1 className="text-5xl font-bold">
              Let’s Chat <span className="text-primary">With Us</span>
            </h1>
          </div>

          <Card>
            <CardContent className="p-8">
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-5">
          {/* Photo */}
          <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] h-[450px] w-full shadow-xl">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALwJUcwaHi5n_1gW4NZy4ZeovwJeDyHpD9m7jO7vrd2NeapjU3czp5-9J5BpOBFfyOJy_yPW5sxreIwxsKrZvDksW99-aHy6YAq_oo3RflAYNcV_QSlzDoKs9o4J92Qu_fbHFn9QPrgefbVx8evE4KH3NNM78L3rWwCMVfPcJdS6dkpi2v5hhlYRgJXUgvXwbEYYqeLeTA3iB1N8toAo_4Lg27o7NvOWLsDv0H95rLpGN0QoYIXPtCQCUftYCDXSBiLrRjtF5nSw"
              alt="Guest Relations"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/70 backdrop-blur-md p-5">
              <p className="font-bold text-[#191c1e] text-base">
                “We ensure every guest finds their perfect home.”
              </p>
              <p className="mt-2 text-sm text-primary font-medium">
                — Guest Relations Team
              </p>
            </div>
          </div>

          {/* Contact cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-5">
            <Card className="bg-[#f2f4f6]">
              <CardContent className="flex items-center gap-6 p-7">
                <Mail className="text-primary" />
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-sm">hello@arch-editorial.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#f2f4f6]">
              <CardContent className="flex items-center gap-6 p-7">
                <Phone className="text-primary" />
                <div>
                  <p className="font-bold">Phone</p>
                  <p className="text-sm">+1 (555) 000-arch</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
