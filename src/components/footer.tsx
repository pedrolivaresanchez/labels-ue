import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/terms"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                Empresa
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                Soporte
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/help"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:soporte@vinoveo.com"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    soporte@vinoveo.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} VinoVeo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 