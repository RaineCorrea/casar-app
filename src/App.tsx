import Header from "./components/layout/Header";
import { Main } from "./components/layout/Main";
import CustomToastContainer from "./components/ui/ToastContainer";

function App() {
  return (
    <>
      {/* Skip Link para Acessibilidade - permite usuários de teclado pular para o conteúdo principal */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-terracotta focus:text-cream focus:px-4 focus:py-2 focus:rounded-lg focus:font-body focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>
      <Header />
      <CustomToastContainer />
      <Main />
    </>
  );
}

export default App;
