import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingGalleryProps {
  data: AcademyWebsiteContent;
}

export default function LandingGallery({ data }: LandingGalleryProps) {
  const images = data.galleryImages?.filter((g) => g.imageUrl) ?? [];
  if (!images.length) return null;

  return (
    <section id="gallery" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12" data-reveal>
          <h2 className="landing-display text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Academy Gallery
          </h2>
          <p className="mt-4 text-slate-600 font-medium">Moments from training, matches and academy life.</p>
          <div data-line className="mx-auto mt-6 h-1 w-16 rounded-full bg-[var(--landing-accent)] origin-left" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal-stagger>
          {images.map((img) => (
            <figure
              key={img.id}
              data-reveal-child
              data-clip-reveal
              className="group relative overflow-hidden rounded-3xl aspect-[4/3] border border-violet-100 shadow-sm"
            >
              <img
                src={img.imageUrl}
                alt={img.caption || "Gallery"}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              {img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-white bg-gradient-to-t from-slate-900/70 to-transparent">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
