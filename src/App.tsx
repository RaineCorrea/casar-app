import Header from "./components/layout/Header";
import { Main } from "./components/layout/Main";
import CustomToastContainer from "./components/ui/ToastContainer";

function App() {
  return (
    <>
      <Header />
      <CustomToastContainer />
      <Main />
    </>
  );
}

export default App;
