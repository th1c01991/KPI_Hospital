export function Header({ usuario, onLogout }) {
  return (
    <header className="bg-white border-b-4 border-[#8CC63F] p-4 shadow-sm">
      <div className="max-w-full mx-auto flex justify-between items-center px-6">
        <div className="flex items-center">
          <img src="/new-logo-americas.svg" alt="Rede Américas" className="h-12 w-auto" />
          <div className="ml-4 border-l-2 border-slate-200 pl-4">
            <h1 className="text-xl font-bold text-[#662D91]">Portal de Indicadores</h1>
            {usuario && (
              <p className="text-xs text-slate-400">{usuario.hospitalNome}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          {usuario && (
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">{usuario.nome}</p>
              <button
                onClick={onLogout}
                className="text-xs text-red-400 hover:text-red-600 transition-all"
              >
                Sair
              </button>
            </div>
          )}
          <img src="/samaritano1_logo.png" alt="Samaritano" className="h-12 w-auto" />
        </div>
      </div>
    </header>
  );
}