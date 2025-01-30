export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Introducción</h2>
          <p className="text-gray-700">
            Al utilizar VinoVeo, confirmas tu aceptación y acuerdas estar sujeto a estos términos y condiciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Acuerdo de Términos y Condiciones</h2>
          <p className="text-gray-700">
            Este Acuerdo entra en vigor en la fecha en que utilizas por primera vez la aplicación VinoVeo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Suscripción y Licencia de Uso</h2>
          <p className="text-gray-700">
            VinoVeo opera bajo un modelo de suscripción anual que proporciona acceso a todas las funcionalidades 
            de la plataforma. La suscripción está diseñada para bodegas, productores de vino y empresas del sector 
            vitivinícola, permitiéndoles crear y gestionar etiquetas de vino que cumplan con la normativa de la UE.
            <br /><br />
            La suscripción incluye actualizaciones regulares para mantener la conformidad con las normativas vigentes. 
            El licenciante se reserva el derecho de modificar, actualizar o terminar el servicio según sea necesario 
            para cumplir con cambios regulatorios o mejoras del sistema.
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
            No se garantiza que VinoVeo cumpla con todos tus requisitos o que su funcionamiento sea ininterrumpido 
            o libre de errores. Si bien nos esforzamos por mantener la precisión de la información y el cumplimiento 
            normativo, es responsabilidad del usuario verificar que las etiquetas generadas cumplan con todas las 
            regulaciones aplicables a su caso específico.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Garantías y Limitación de Responsabilidad</h2>
          <p className="text-gray-700">
            VinoVeo no ofrece garantías sobre la calidad, idoneidad para un propósito particular u otros aspectos 
            del software. No seremos responsables de pérdidas de beneficios o daños indirectos, especiales o 
            consecuentes que puedan surgir del uso de nuestros servicios. Nuestra responsabilidad máxima se 
            limitará al monto pagado por tu suscripción anual.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Responsabilidades</h2>
          <p className="text-gray-700">
            VinoVeo no es responsable del uso que el usuario haga del contenido generado. Es responsabilidad del 
            usuario asegurar que la información proporcionada en las etiquetas sea precisa y cumpla con todas las 
            regulaciones aplicables.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Ajustes de Precio</h2>
          <p className="text-gray-700">
            A medida que continuamos mejorando VinoVeo y expandiendo nuestras funcionalidades, el precio puede 
            aumentar. Los usuarios activos serán notificados de cualquier cambio en los precios con al menos 30 
            días de anticipación.
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
            de la UE. Para más información sobre cómo manejamos tus datos, consulta nuestra Política de Privacidad.
          </p>
        </section>

        <footer className="mt-12 pt-8 border-t text-sm text-gray-600">
          <p>Última actualización: 21 de marzo de 2024</p>
          <p>Términos y Condiciones | VinoVeo</p>
        </footer>
      </div>
    </div>
  );
} 