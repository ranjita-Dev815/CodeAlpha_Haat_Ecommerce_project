import { useState } from 'react';

// Usage: <ImageGallery key={product._id} image={product.image} images={product.images} alt={product.name} />
export default function ImageGallery({ image, images, alt = '' }) {
  const gallery = [image, ...(images ?? []).filter((src) => src && src !== image)].filter(Boolean);
  const [active, setActive] = useState(gallery[0]);

  return (
    <div className="gallery">
      <img className="gallery-main" src={active} alt={alt} width="600" height="600" />

      {gallery.length > 1 && (
        <div className="gallery-thumbs">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`gallery-thumb${src === active ? ' is-active' : ''}`}
              onClick={() => setActive(src)}
              aria-label={`View image ${i + 1} of ${gallery.length}`}
              aria-pressed={src === active}
            >
              <img src={src} alt="" width="72" height="72" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
