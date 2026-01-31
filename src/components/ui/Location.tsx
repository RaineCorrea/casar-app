import { Element } from "react-scroll";
import { DecoracaoCirculos, DecoracaoFolha, PinLocalizacao, IconeSetaDireita, IconeRelogio, IconeHome } from "../icons";

interface LocationProps {
  embedUrl?: string;
  title?: string;
}

export default function Location({
  embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.555709079446!2d-42.4949624!3d-22.3326366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x978bf392346977%3A0x18580ad35fc3a315!2sVilla%20Massari!5e0!3m2!1spt-BR!2sbr!4v1769781579878!5m2!1spt-BR!2sbr",
  title = "Villa Massari",
}: LocationProps) {
  return (
    <Element
      name="location"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, var(--color-cream) 0%, var(--color-sage-light) 30%, var(--color-forest) 100%)`,
      }}
    >
      <div className="absolute top-10 left-10 w-40 h-40 opacity-20">
        <DecoracaoCirculos />
      </div>
      <div className="absolute bottom-20 right-10 w-32 h-32 opacity-15 animate-sway">
        <DecoracaoFolha />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-forest-dark text-sm uppercase tracking-widest mb-3 font-body font-semibold">
            Cerimônia & Recepção
          </p>

          <h2 className="font-display text-forest-dark text-4xl md:text-5xl mb-4 font-semibold">
            {title}
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 h-px bg-forest-dark/50" />
            <PinLocalizacao />
            <span className="w-16 h-px bg-forest-dark/50" />
          </div>

          <p className="font-body text-forest-dark text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Estrada Vereador Eugênio Guilherme Spitz, 2250
            <br />
            <span className="text-forest/90">Mury, Nova Friburgo - RJ</span>
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-3 bg-cream/20 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500" />
          <div className="absolute -inset-3 bg-cream/10 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500" />

          <div
            className="relative bg-cream rounded-2xl overflow-hidden shadow-lifted"
            style={{ aspectRatio: '16/9' }}
          >
            <iframe
              src={embedUrl}
              className="w-full h-full"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={title}
            />

            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                boxShadow: 'inset 0 0 40px rgba(45, 74, 62, 0.1)',
              }}
            />
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/place/Villa+Massari/@-22.3326366,-42.4949624,17z/data=!3m1!4b1!4m6!3m5!1s0x978bf392346977:0x18580ad35fc3a315!8m2!3d-22.3326366!4d-42.4949624!16s%2Fg%2F11l2f99k91"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-cream text-forest px-8 py-4 rounded-full font-body text-lg shadow-soft hover:shadow-lifted hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 text-terracotta group-hover:scale-110 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>Abrir no Google Maps</span>
            <IconeSetaDireita />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div className="bg-cream/95 backdrop-blur-sm rounded-2xl p-8 shadow-soft">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-sage-light/50 flex items-center justify-center">
                <IconeRelogio />
              </div>
              <h3 className="font-display text-forest text-xl">Horário</h3>
            </div>
            <p className="text-forest-dark/80 font-body leading-relaxed">
              Cerimônia às <strong className="text-terracotta">16h</strong>
              <br />
              <span className="text-sm text-sage-muted">Recepção logo após a cerimônia</span>
            </p>
          </div>

          <div className="bg-cream/95 backdrop-blur-sm rounded-2xl p-8 shadow-soft">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-sage-light/50 flex items-center justify-center">
                <IconeHome />
              </div>
              <h3 className="font-display text-forest text-xl">Traje</h3>
            </div>
            <p className="text-forest-dark/80 font-body leading-relaxed">
              Traje <strong className="text-terracotta">Esporte Fino</strong>
              <br />
              <span className="text-sm text-sage-muted">Sugestão: tons terrosos e naturais</span>
            </p>
          </div>
        </div>
      </div>
    </Element>
  );
}
