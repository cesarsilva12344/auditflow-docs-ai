import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

/**
 * Direção visual: réplica fiel do AuditFlow de referência com linguagem neo-editorial SaaS
 * operacional. Este shell mantém o header compacto, fundo lavanda, azul AuditFlow #1554D1,
 * cards brancos e navegação contextual. O produto fica restrito a documentos, processos,
 * prompts e copiloto IA.
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Home />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
