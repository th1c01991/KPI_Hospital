// src/components/Header.jsx
export function Header() {
  return (
    <header className="bg-white border-b-4 border-[#8CC63F] p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/new-logo-americas.svg" alt="Rede Américas" className="h-12 w-auto" />
          <div className="ml-4 border-l-2 border-slate-200 pl-4">
            <h1 className="text-xl font-bold text-[#662D91]">Portal de Indicadores</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <img src="/Hospital_Vitoriabarra_1_b7b58df30b.svg" alt="Vitória" className="h-5 w-auto" />
          <img src="/samaritano1_logo.png" alt="Samaritano" className="h-12 w-auto" />
        </div>
      </div>
    </header>
  );
}