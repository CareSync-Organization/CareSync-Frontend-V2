import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
};

export function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrevious = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    function handleSelect() {
      setSelectedIndex(emblaApi!.selectedScrollSnap());
    }

    handleSelect();
    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full max-w-xl">
      <Quote className="mb-5 size-10 text-white/30" />

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="min-w-0 flex-[0_0_100%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${testimonial.name}-${selectedIndex}`}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <blockquote className="text-lg font-semibold leading-7 text-white">
                    “{testimonial.quote}”
                  </blockquote>

                  <div className="mt-6">
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="mt-1 text-sm text-white/75">
                      {testimonial.role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={scrollPrevious}
          className="grid size-8 cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Show testimonial ${index + 1}`}
              className={
                index === selectedIndex
                  ? "h-1.5 w-7 cursor-pointer rounded-full bg-white transition-all"
                  : "size-1.5 cursor-pointer rounded-full bg-white/45 transition-all hover:bg-white/70"
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          className="grid size-8 cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Next testimonial"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
