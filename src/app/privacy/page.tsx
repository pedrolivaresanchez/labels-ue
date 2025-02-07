'use client';

import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6 md:p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Política de Privacidad de VinoVeo</h1>
          <p className="text-sm text-muted-foreground">Fecha de creación: 17 de diciembre de 2024</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Responsable del Tratamiento de Datos</h2>
            <div className="space-y-2">
              <p>Responsable: Pedro Olivares Sánchez</p>
              <p>NIF: 24441859N</p>
              <p>Dirección: Gardenia Livings, Dubái</p>
              <p>Teléfono: +971 58 577 2569</p>
              <p>Email de contacto: info@vinoveo.com</p>
            </div>
            <p className="mt-4">
              Pedro Olivares Sánchez es el <strong>responsable del tratamiento de datos</strong> de VinoVeo, 
              ya que gestiona directamente la recopilación, uso y protección de los datos personales de los usuarios. 
              La empresa <strong>CVPO SL</strong> actúa exclusivamente como <strong>intermediario de facturación</strong>, 
              sin acceso directo ni control sobre la gestión de datos personales de los usuarios. En caso de que CVPO SL 
              tenga algún acceso limitado a información de facturación, actuará conforme a los acuerdos de confidencialidad 
              y protección de datos aplicables.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Datos que Recopilamos</h2>
            <p>VinoVeo recopila datos personales limitados cuando los usuarios se suscriben a nuestro servicio. Los datos recopilados pueden incluir:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Datos de suscripción:</strong> nombre, correo electrónico, información de facturación y detalles de pago.</li>
              <li><strong>Datos de uso:</strong> número de etiquetas generadas, interacciones con la plataforma.</li>
              <li><strong>Datos técnicos:</strong> tipo de navegador, sistema operativo, dirección IP (anonimizada cuando sea posible).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Finalidad del Tratamiento</h2>
            <p>Los datos recopilados se utilizan para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestionar la suscripción y los pagos de los usuarios.</li>
              <li>Proporcionar y mejorar la funcionalidad de la plataforma.</li>
              <li>Analizar el rendimiento del sistema.</li>
              <li>Garantizar la seguridad del servicio.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Base Legal para el Tratamiento</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Ejecución de un contrato:</strong> para gestionar suscripciones y procesar pagos.</li>
              <li><strong>Interés legítimo:</strong> para mejorar el servicio y la seguridad de la plataforma.</li>
              <li><strong>Cumplimiento legal:</strong> en casos de obligaciones fiscales o regulatorias.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Compartición de Datos</h2>
            <p>
              Para procesar pagos, utilizamos el servicio de <strong>Stripe, Inc.</strong> Stripe actúa como 
              <strong>encargado del tratamiento</strong> de los datos de pago en nuestro nombre. Sin embargo, 
              también puede actuar como <strong>responsable independiente</strong> para ciertos datos necesarios 
              para cumplir con sus propias obligaciones legales (por ejemplo, en la prevención del fraude).
            </p>
            <p>
              Puedes consultar la política de privacidad de Stripe aquí: 
              <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline ml-1">
                https://stripe.com/privacy
              </a>
            </p>
            <p>
              No compartimos datos personales con otros terceros, salvo que sea necesario para el cumplimiento 
              legal o con tu consentimiento explícito.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Seguridad de la Información</h2>
            <p>
              Implementamos medidas técnicas y organizativas para proteger la información personal contra 
              accesos no autorizados, pérdidas o alteraciones.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Derechos de los Usuarios</h2>
            <p>Como usuario, tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a tus datos personales.</li>
              <li>Solicitar la rectificación o supresión de tus datos.</li>
              <li>Oponerte al tratamiento o solicitar la limitación del mismo.</li>
              <li>Solicitar la portabilidad de tus datos.</li>
            </ul>
            <p>
              Puedes ejercer estos derechos contactándonos a través del correo electrónico: info@vinoveo.com.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Cambios en la Política de Privacidad</h2>
            <p>
              Nos reservamos el derecho de modificar esta política para adaptarla a nuevas regulaciones o mejoras 
              en el servicio. Cualquier cambio será notificado a través de nuestra web.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contacto</h2>
            <p>
              Para cualquier duda o consulta relacionada con esta política, puedes escribirnos a: info@vinoveo.com.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Esta política está diseñada para ofrecer transparencia sobre el tratamiento de datos en VinoVeo, 
              cumpliendo con la normativa de protección de datos aplicable en la UE y otros territorios relevantes.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
} 