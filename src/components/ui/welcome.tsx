import { Element } from "react-scroll";
import { Link } from "react-scroll";
import {
  FolhaBotanica1,
  FolhaBotanica2,
  FlorDecorativa,
  FolhaAssinatura,
  IconeRolarParaBaixo,
} from "../icons";

export default function Welcome() {
  return (
    <Element
      name="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(45, 74, 62, 0.7) 0%,
              rgba(45, 74, 62, 0.5) 50%,
              rgba(250, 248, 243, 0.95) 100%
            ),
            url('https://static.wixstatic.com/media/16cd27_6977ba76179542fe8a59b4d40c0f6fde~mv2.jpg/v1/fill/w_1339,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/16cd27_6977ba76179542fe8a59b4d40c0f6fde~mv2.jpg')
          `,
        }}
      />

      <div className="absolute top-20 left-10 w-32 h-32 opacity-20 animate-sway">
        <FolhaBotanica1 />
      </div>
      <div
        className="absolute bottom-40 right-10 w-24 h-24 opacity-15 animate-sway"
        style={{ animationDelay: "1s" }}
      >
        <FolhaBotanica2 />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          className="mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <FlorDecorativa />
        </div>

        <h1
          className="font-accent text-cream text-8xl md:text-9xl mb-4 opacity-0 animate-fade-up tracking-wide"
          style={{
            animationDelay: "0.4s",
            textShadow: "2px 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          Matheus & Nicolly
        </h1>

        <div
          className="opacity-0 animate-fade-up mb-12"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="font-display text-cream/90 text-2xl md:text-3xl tracking-wider">
            18 de Novembro de 2026
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="w-16 h-px bg-cream/40" />
            <span className="font-body text-cream/70 text-lg italic">
              Villa Massari
            </span>
            <span className="w-16 h-px bg-cream/40" />
          </div>
        </div>

        <div
          className="bg-cream/95 backdrop-blur-sm rounded-2xl p-10 md:p-14 shadow-lifted opacity-0 animate-fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          <h2 className="font-display text-forest text-3xl md:text-4xl mb-8 font-medium">
            Sejam Bem-Vindos
          </h2>

          <div className="space-y-6 text-forest-dark/90 text-lg leading-relaxed max-w-2xl mx-auto">
            <p>
              Criamos este espaço com todo carinho para dividir com vocês os
              detalhes desse momento tão especial em nossas vidas. Aqui, vocês
              encontrarão informações importantes para que possam se programar e
              celebrar conosco de forma inesquecível.
            </p>

            <p>
              Um ponto muito importante é a{" "}
              <strong className="text-terracotta font-semibold">
                confirmação de presença
              </strong>
              , que deve ser feita no menu "Confirmar Presença". Esse gesto é
              essencial para que possamos organizar tudo da melhor forma
              possível.
            </p>

            <p>
              Para aqueles que desejarem nos presentear, deixamos disponível
              nossa lista de presentes, que é apenas uma sugestão. Sintam-se à
              vontade para escolher o que desejarem ou até mesmo pensar em algo
              diferente. Para nós, o que mais importa é o carinho de cada um!
            </p>

            <p className="italic text-forest/80">
              Este cantinho foi feito com muito amor para que vocês possam
              acompanhar de perto cada passo até o altar. Estamos contando os
              dias para viver esse momento único ao lado das pessoas mais
              especiais das nossas vidas:
              <span className="text-terracotta font-medium"> vocês!</span>
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-forest/20">
            <p className="text-forest/70 text-sm uppercase tracking-widest mb-2 font-semibold">
              Com carinho,
            </p>
            <p className="font-accent text-forest-dark text-5xl">
              Matheus & Nicolly
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <FolhaAssinatura />
          </div>
        </div>

        <Link
          to="countdown"
          smooth={true}
          duration={800}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer opacity-0 animate-fade-up group"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="flex flex-col items-center text-forest-dark hover:text-terracotta transition-colors duration-300">
            <span className="text-sm tracking-widest uppercase mb-2 font-semibold">
              Rolar
            </span>
            <IconeRolarParaBaixo />
          </div>
        </Link>
      </div>
    </Element>
  );
}
