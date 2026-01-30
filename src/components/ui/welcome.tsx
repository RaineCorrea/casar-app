import { Element } from "react-scroll";

export default function Welcome() {
  return (
    <Element name="home" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Sejam bem-vindos ao nosso site!</h1>
      <p>
        Criamos este espaço para dividir com vocês todos os detalhes desse
        momento tão especial em nossas vidas. Aqui, vocês encontrarão
        informações importantes para que possam se programar e celebrar conosco
        de forma inesquecível.
      </p>
      <p>
        Um ponto muito importante é a <strong>confirmação de presença</strong>,
        que deve ser feita no menu “confirme sua presença”. Esse gesto é
        essencial para que possamos organizar tudo da melhor forma possível.
      </p>
      <p>
        Para aqueles que desejarem nos presentear, deixamos disponível nossa
        lista de presentes, que é apenas uma sugestão. Sintam-se à vontade para
        escolher o que desejarem ou até mesmo pensar em algo diferente. Para
        nós, o que mais importa é o carinho de cada um!
      </p>
      <p>
        Este cantinho foi feito com muito amor para que vocês possam acompanhar
        de perto cada passo até o altar. Estamos contando os dias para viver
        esse momento único ao lado das pessoas mais especiais das nossas vidas:
        vocês!
      </p>
      <p>Com carinho,</p>
      <p>
        <strong>Matheus & Nicolly</strong>
      </p>
    </Element>
  );
}
