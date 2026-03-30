// src/routes/unauthorized.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary-container/10 p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] right-[2%] w-[30rem] h-[30rem] bg-secondary-container/20 rounded-full blur-[80px]" />
      </div>

      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-surface-container-lowest overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Side: Visual/Branding */}
          <div className="md:col-span-5 bg-gradient-to-br from-primary to-primary-container p-8 lg:p-12 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10">
              <Badge
                variant="outline"
                className="border-white/30 text-white/90 mb-4 tracking-widest text-xs"
              >
                SEGURIDAD INSTITUCIONAL
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-6">
                Acceso Restringido
              </h2>
              <p className="text-primary-fixed-dim text-lg leading-relaxed font-light">
                El sistema ha detectado un intento de ingreso a un área protegida
                de la plataforma académica.
              </p>
            </div>

            <div className="relative z-10 mt-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Protocolo 403</p>
                  <p className="text-xs opacity-60">Identity Management System</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interaction */}
          <div className="md:col-span-7 p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-error-container rounded-2xl flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="hsl(var(--error))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-error"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                No tienes permisos para acceder a esta sección
              </h1>
              <CardDescription className="text-secondary leading-relaxed text-base">
                Su perfil actual no cuenta con las credenciales necesarias para
                visualizar este contenido. Si considera que esto es un error, por
                favor contacte al administrador del sistema o al departamento de TI.
              </CardDescription>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/" className="group">
                <Card className="bg-surface-container-low hover:bg-surface-container-lowest border-transparent hover:border-outline-variant transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col gap-3">
                    <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                    </div>
                    <div>
                      <span className="block font-semibold text-primary">
                        Volver al Dashboard
                      </span>
                      <span className="text-xs text-secondary">
                        Regresar a su panel principal
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/login" className="group">
                <Card className="bg-surface-container-low hover:bg-surface-container-lowest border-transparent hover:border-outline-variant transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col gap-3">
                    <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center text-on-surface-variant transition-transform group-hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                    </div>
                    <div>
                      <span className="block font-semibold text-foreground">
                        Cerrar Sesión
                      </span>
                      <span className="text-xs text-secondary">
                        Salir de la cuenta de forma segura
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Support Footer */}
            <div className="mt-12 pt-8 border-t border-surface-container-highest flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span className="text-xs font-medium tracking-wider">
                  Ref: AUTH_ERROR_403_ST
                </span>
              </div>
              <a
                href="#"
                className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
              >
                Soporte Técnico
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
