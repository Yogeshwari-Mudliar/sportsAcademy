import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingGalleryProps {
  data: AcademyWebsiteContent;
}

export default function LandingGallery({ data }: LandingGalleryProps) {
  const images = data.galleryImages?.filter((g) => g.imageUrl) ?? [];
  if (!images.length) return null;

  return (
    <section id="gallery" className="py-14 md:py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black">Academy Gallery</h2>
          <p className="mt-3 text-white/60">Moments from training, matches and academy life.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <figure key={img.id} className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={img.imageUrl}
                alt={img.caption || "Gallery"}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              {img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-sm font-medium">
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
