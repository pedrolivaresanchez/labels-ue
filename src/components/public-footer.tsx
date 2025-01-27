'use client';

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center gap-4 md:h-16 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} Vinoveo. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/legal/terminos-y-condiciones" 
            className="text-sm text-muted-foreground hover:underline"
          >
            Términos y Condiciones
          </Link>
          <Dialog>
            <DialogTrigger className="text-sm text-muted-foreground hover:underline">
              Aviso Legal
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pr-8">
                <DialogTitle className="mb-4">Aviso Legal</DialogTitle>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
                <DialogDescription className="text-sm leading-relaxed">
                  Con el acceso y/o uso de la Solución y/o a la información puesta a su disposición, Usted reconoce y acepta que Vinoveo no será responsable (i) de cualesquiera alteraciones en su dispositivo, sistema informático, documentos o ficheros de su titularidad o de terceros; (ii) de retrasos o bloqueos en los sistemas asociados a la Solución causados por deficiencias o sobrecargas en el sistema cualquiera que sea su causa; (iii) de interrupciones, eventuales indisponibilidades de acceso y/o de uso a la Solución, virus informáticos, malwares, averías u otros elementos que puedan estar presentes en la Solución a la que accede independientemente de la causa; (iv) de intromisiones ilegitimas causadas por terceros, que sean ajenos a Vinoveo; (v) ni por los daños y perjuicios causados frente a Usted y/o cualesquiera terceros que por tal acceso y/o uso pudieran ocasionarse.
                  <br /><br />
                  Vinoveo no es el titular de la información contenida en la Solución, por lo que no asume responsabilidad alguna por (i) la mala utilización de los contenidos puestos a su disposición a través de la Solución; (ii) las consecuencias que pudieran derivarse de los errores, defectos u omisiones de la información proporcionada a través de esta; (iii) por los incumplimientos legales o infracciones que se deriven de los datos o contenidos de terceros que se transmitan a través de la misma o se almacenen en esta; (iv) por los contenidos de los enlaces facilitados a través de la Solución, pertenecientes a un sitio ajeno.
                  <br /><br />
                  Vinoveo no garantizará la disponibilidad técnica, calidad, veracidad y/o legalidad de cualquier material o información contenida en dichos hipervínculos u otros sitios de Internet. La inclusión de estos enlaces no implicará ningún tipo de asociación o participación con las entidades conectadas. En ningún caso, el acceso y/o uso de la Solución o de la información que esta contiene por parte de Usted o terceros supone el otorgamiento de una licencia o cesión total o parcial de derechos sobre la Información por parte de Vinoveo a Usted o a terceros, salvo que se establezca expresamente.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  );
}