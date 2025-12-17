import { BrowserRouter, Routes, Route } from "react-router-dom";
import AbsenDatang from "./pages/AbsenDatang";
import AbsenPulang from "./pages/AbsenPulang";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AbsenDatang />} />
        <Route path="/pulang" element={<AbsenPulang />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
