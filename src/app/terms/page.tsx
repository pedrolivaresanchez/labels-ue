'use client';

import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6 md:p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Términos y Condiciones de VinoVeo</h1>
          <p className="text-sm text-muted-foreground">Fecha de entrada en vigor: 6 de febrero de 2025</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Información General</h2>
            <p>
              Estos Términos y Condiciones regulan el uso de la plataforma VinoVeo, un servicio SaaS para la generación 
              de etiquetas electrónicas (e-Labels) con códigos QR, conforme a la normativa UE 2021/2117. Al registrarte 
              y utilizar nuestro servicio, aceptas estos términos.
            </p>
            <div className="space-y-2">
              <p>Responsable: Pedro Olivares Sánchez</p>
              <p>NIF: 24441859N</p>
              <p>Dirección: Gardenia Livings, Dubái</p>
              <p>Teléfono: +971 58 577 2569</p>
              <p>Email de contacto: info@vinoveo.com</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Prueba Gratuita y Política de Devoluciones</h2>
            <p>
              Dado que VinoVeo es un servicio electrónico, los usuarios disponen de <strong>7 días hábiles</strong> desde 
              la activación de su suscripción para probar el servicio y valorar si se adecua a sus necesidades. Durante 
              este periodo, puedes cancelar tu suscripción sin coste alguno.
            </p>
            <p>
              Tras este período de prueba, se permiten devoluciones o reembolsos solo si se solicitan dentro de los 
              <strong>7 días naturales</strong> posteriores a la finalización de la prueba gratuita. No se realizarán 
              devoluciones fuera de este plazo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Registro y Cuenta de Usuario</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Debes proporcionar información veraz y actualizada al registrarte.</li>
              <li>Eres responsable de mantener la confidencialidad de tus credenciales de acceso.</li>
              <li>Nos reservamos el derecho de suspender o cancelar cuentas en caso de uso indebido del servicio.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Uso Aceptable del Servicio</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>VinoVeo debe utilizarse exclusivamente para fines legales y conforme a la normativa vigente.</li>
              <li>No está permitido el uso del servicio para generar etiquetas con información falsa, fraudulenta o que infrinja derechos de terceros.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Propiedad Intelectual</h2>
            <p>
              Todos los derechos de propiedad intelectual sobre la plataforma, su contenido, software y tecnología 
              subyacente son propiedad de VinoVeo o de sus licenciantes. El uso del servicio no otorga ningún derecho 
              sobre dicha propiedad intelectual, salvo los derechos limitados de uso descritos en estos términos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Limitación de Responsabilidad</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>VinoVeo no se hace responsable de daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del servicio.</li>
              <li>No garantizamos que el servicio estará libre de errores o interrupciones, aunque trabajamos para garantizar la máxima disponibilidad.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Procesamiento de Pagos y Datos</h2>
            <p>
              Para procesar pagos, utilizamos el servicio de <strong>Stripe, Inc.</strong> como encargado del tratamiento 
              de los datos de pago. Stripe también actúa como responsable independiente para ciertos datos necesarios 
              para cumplir con sus obligaciones legales.
            </p>
            <p>
              Puedes consultar la política de privacidad de Stripe aquí: 
              <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline ml-1">
                https://stripe.com/privacy
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Modificaciones del Servicio y de los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar el servicio o estos Términos y Condiciones en cualquier momento. 
              Notificaremos cualquier cambio importante a través de la plataforma o por correo electrónico.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Cancelación y Terminación del Servicio</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Puedes cancelar tu suscripción en cualquier momento desde tu cuenta.</li>
              <li>Nos reservamos el derecho de suspender o cancelar el acceso al servicio si detectamos un incumplimiento de estos términos.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se rigen por la legislación vigente en España y cualquier disputa derivada 
              de su interpretación o aplicación se someterá a los tribunales competentes de Valencia, España.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con estos Términos y Condiciones, puedes contactarnos en: info@vinoveo.com
            </p>
          </section>

          <section className="mt-8 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Al utilizar VinoVeo, aceptas haber leído y comprendido estos Términos y Condiciones, así como la Política 
              de Privacidad asociada.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
} 