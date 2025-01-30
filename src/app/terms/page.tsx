import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
        
        <div className="space-y-8 bg-white p-8 rounded-lg shadow">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introducción</h2>
            <p className="text-gray-700">
              Al utilizar VinoVeo, confirmas tu aceptación y acuerdas estar sujeto a estos términos y condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Acuerdo de Términos y Condiciones</h2>
            <p className="text-gray-700">
              Este Acuerdo entra en vigor en la fecha en que utilices por primera vez la aplicación VinoVeo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Suscripción y Licencia de Uso</h2>
            <p className="text-gray-700">
              VinoVeo opera bajo un modelo de suscripción anual que proporciona acceso a todas las funcionalidades 
              de la plataforma durante el período de suscripción activa. Diseñado para bodegas, productores de vino 
              y distribuidores, VinoVeo permite a los usuarios crear y gestionar etiquetas de vino conformes con la 
              normativa de la UE, incluyendo códigos QR para información detallada del producto.
            </p>
            <p className="text-gray-700 mt-4">
              La suscripción se renueva automáticamente al final de cada período, a menos que el usuario la cancele. 
              El licenciante se reserva el derecho de modificar, suspender o terminar el servicio con previo aviso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Política de Reembolsos</h2>
            <p className="text-gray-700">
              Debido a la naturaleza del servicio digital, las suscripciones a VinoVeo no son reembolsables una vez 
              activadas. Los usuarios pueden cancelar su suscripción en cualquier momento, pero seguirán teniendo 
              acceso hasta el final del período facturado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Descargo de Responsabilidad</h2>
            <p className="text-gray-700">
              No se garantiza que VinoVeo cumpla con todos tus requisitos específicos o que su funcionamiento sea 
              ininterrumpido o libre de errores. Todas las garantías expresas e implícitas no establecidas en este 
              Acuerdo quedan excluidas y expresamente rechazadas en la medida permitida por la ley aplicable. Este 
              Acuerdo no afecta tus derechos estatutarios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Garantías y Limitación de Responsabilidad</h2>
            <p className="text-gray-700">
              VinoVeo no ofrece garantías sobre la calidad o idoneidad del software para un propósito particular. 
              No seremos responsables de pérdidas de beneficios o daños indirectos, especiales o consecuentes que 
              surjan del uso del servicio. Nuestra responsabilidad máxima se limita al monto pagado por tu 
              suscripción actual.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Responsabilidades</h2>
            <p className="text-gray-700">
              VinoVeo no es responsable del uso que el usuario haga del contenido generado. Los usuarios son 
              responsables de asegurar que la información proporcionada en las etiquetas cumple con todas las 
              regulaciones aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Ajustes de Precio</h2>
            <p className="text-gray-700">
              A medida que continuamos mejorando VinoVeo y expandiendo nuestras ofertas, los precios pueden 
              aumentar. Cualquier cambio en los precios se notificará con al menos 30 días de anticipación y 
              no afectará a las suscripciones activas hasta su próxima renovación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Términos Generales y Ley Aplicable</h2>
            <p className="text-gray-700">
              Este Acuerdo se rige por las leyes de España. Reconoces que no existe ninguna relación de empresa 
              conjunta, asociación, empleo o agencia entre tú y VinoVeo como resultado del uso de estos servicios. 
              Aceptas no presentarte como representante, agente o empleado de VinoVeo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Protección de Datos</h2>
            <p className="text-gray-700">
              VinoVeo procesa datos personales de acuerdo con el Reglamento General de Protección de Datos (RGPD) 
              de la UE. Para más información sobre cómo manejamos tus datos, consulta nuestra{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidad
              </Link>.
            </p>
          </section>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Última actualización: 21 de marzo de 2024
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Términos y Condiciones | VinoVeo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 