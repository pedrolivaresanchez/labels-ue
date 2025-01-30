'use client';

import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6 md:p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
          <p className="text-sm text-muted-foreground">Última actualización: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introducción</h2>
            <p>
              Al acceder y utilizar VinoVeo, aceptas estos términos y condiciones en su totalidad. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Acuerdo de Términos y Condiciones</h2>
            <p>
              Este acuerdo entra en vigor cuando accedes o utilizas VinoVeo por primera vez. 
              Nos reservamos el derecho de modificar estos términos en cualquier momento, y tu uso continuado 
              del servicio después de dichos cambios constituye tu aceptación de los nuevos términos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Suscripción y Licencia de Uso</h2>
            <p>
              VinoVeo opera bajo un modelo de suscripción. Al suscribirte, obtienes una licencia limitada, 
              no exclusiva y no transferible para usar nuestros servicios de acuerdo con estos términos. 
              La suscripción se renueva automáticamente a menos que la canceles antes de la fecha de renovación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Política de Reembolsos</h2>
            <p>
              Como proveedor de servicios digitales, ofrecemos reembolsos dentro de los primeros 14 días 
              desde la suscripción inicial si no has utilizado significativamente el servicio. Las renovaciones 
              automáticas no son reembolsables.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Descargo de Responsabilidad</h2>
            <p>
              VinoVeo se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio 
              será ininterrumpido, oportuno o libre de errores. No nos hacemos responsables de las pérdidas 
              o daños que puedas sufrir como resultado del uso de nuestro servicio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Garantías y Limitación de Responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley, VinoVeo no ofrece garantías de ningún tipo, ya sean 
              expresas o implícitas. No seremos responsables de ningún daño indirecto, incidental, especial 
              o consecuente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Responsabilidades</h2>
            <p>
              Eres responsable de mantener la confidencialidad de tu cuenta y de todo el contenido que generes 
              o subas a través de nuestro servicio. Te comprometes a no usar el servicio para ningún propósito 
              ilegal o no autorizado.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Ajustes de Precio</h2>
            <p>
              Nos reservamos el derecho de modificar nuestros precios en cualquier momento. Te notificaremos 
              con al menos 30 días de anticipación sobre cualquier cambio en los precios. Los cambios de precio 
              no se aplicarán retroactivamente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Protección de Datos</h2>
            <p>
              El tratamiento de tus datos personales se rige por nuestra Política de Privacidad, que cumple 
              con el Reglamento General de Protección de Datos (RGPD) y otras leyes de protección de datos 
              aplicables.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
} 