"use client";

import { useRouter } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { CardPreview } from "@/components/ui/CardPreview";
import { ImageSlideshow } from "@/components/ui/ImageSlideshow";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/i18n/strings";
import { projects } from "@/data/projects";

export default function WorkPage() {
  const projectCount = projects.length;
  const { lang, isHebrew } = useLanguage();
  const s = useTranslation(lang);
  const router = useRouter();

  const featured = projects[0];
  const pair = projects.slice(1, 3);
  const grid3 = projects.slice(3, 6);
  const rest = projects.slice(6);

  function handleCardClick(slug: string) {
    router.push(`/work/${slug}`);
  }

  return (
    <main>
      <div className="section content-wrap">
        <Reveal>
          <div className="section-head" style={{ paddingInline: 0 }}>
            <h1 className="text-display font-display">{s.workTitle}</h1>
            <p className="subtitle text-label">{s.workSubtitle(projectCount)}</p>
          </div>
        </Reveal>
      </div>

      {projectCount > 0 ? (
        <div className="work-showcase">
          {/* Featured */}
          {featured && (
            <Reveal>
              <button
                type="button"
                className="work-card work-featured"
                data-slug={featured.slug}
                onClick={() => handleCardClick(featured.slug)}
                aria-label={`View project: ${isHebrew && featured.heTitle ? featured.heTitle : featured.title}`}
              >
                {featured.images.length > 1 ? (
                  <ImageSlideshow images={featured.images} />
                ) : featured.images[0] ? (
                  <img
                    src={featured.images[0]}
                    alt=""
                    className="work-card-img"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <CardPreview slug={featured.slug} />
                )}
                <div className="work-card-overlay" />
                <div className="work-card-content">
                  <h2 className="work-card-title">
                    {isHebrew && featured.heTitle ? featured.heTitle : featured.title}
                  </h2>
                </div>
              </button>
            </Reveal>
          )}

          {/* Pair */}
          {pair.length > 0 && (
            <div className="work-pair">
              {pair.map((project, i) => (
                <Reveal key={project.slug} delay={i * 80}>
                  <button
                    type="button"
                    className="work-card"
                    data-slug={project.slug}
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => handleCardClick(project.slug)}
                    aria-label={`View project: ${isHebrew && project.heTitle ? project.heTitle : project.title}`}
                  >
                    {project.images.length > 1 ? (
                      <ImageSlideshow images={project.images} />
                    ) : project.images[0] ? (
                      <img
                        src={project.images[0]}
                        alt=""
                        className="work-card-img"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <CardPreview slug={project.slug} />
                    )}
                    <div className="work-card-overlay" />
                    <div className="work-card-content">
                      <h2 className="work-card-title">
                        {isHebrew && project.heTitle ? project.heTitle : project.title}
                      </h2>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}

          {/* Tight 3 */}
          {grid3.length > 0 && (
            <div className="work-grid-3">
              {grid3.map((project, i) => (
                <Reveal key={project.slug} delay={i * 60}>
                  <button
                    type="button"
                    className="work-card"
                    data-slug={project.slug}
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => handleCardClick(project.slug)}
                    aria-label={`View project: ${isHebrew && project.heTitle ? project.heTitle : project.title}`}
                  >
                    {project.images.length > 1 ? (
                      <ImageSlideshow images={project.images} />
                    ) : project.images[0] ? (
                      <img
                        src={project.images[0]}
                        alt=""
                        className="work-card-img"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <CardPreview slug={project.slug} />
                    )}
                    <div className="work-card-overlay" />
                    <div className="work-card-content">
                      <h2 className="work-card-title">
                        {isHebrew && project.heTitle ? project.heTitle : project.title}
                      </h2>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}

          {/* Remaining projects as tight pair rows */}
          {rest.length > 0 && (
            <div className="work-pair">
              {rest.map((project, i) => (
                <Reveal key={project.slug} delay={i * 60}>
                  <button
                    type="button"
                    className="work-card"
                    data-slug={project.slug}
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => handleCardClick(project.slug)}
                    aria-label={`View project: ${isHebrew && project.heTitle ? project.heTitle : project.title}`}
                  >
                    {project.images.length > 1 ? (
                      <ImageSlideshow images={project.images} />
                    ) : project.images[0] ? (
                      <img
                        src={project.images[0]}
                        alt=""
                        className="work-card-img"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <CardPreview slug={project.slug} />
                    )}
                    <div className="work-card-overlay" />
                    <div className="work-card-content">
                      <h2 className="work-card-title">
                        {isHebrew && project.heTitle ? project.heTitle : project.title}
                      </h2>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="content-wrap">
          <Reveal>
            <p className="subtitle">Project data is currently unavailable. Please refresh shortly.</p>
          </Reveal>
        </div>
      )}
    </main>
  );
}
