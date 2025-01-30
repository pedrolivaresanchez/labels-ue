'use client';

import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6 md:p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Política de Privacidad</h1>
          <p className="text-sm text-muted-foreground">Última actualización: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introducción</h2>
            <p>
              En VinoVeo, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, 
              utilizamos y protegemos tu información personal cuando utilizas nuestra plataforma de etiquetado de vinos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Información que Recopilamos</h2>
            <div className="space-y-2">
              <p>Recopilamos la siguiente información:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Información de la cuenta (email, nombre)</li>
                <li>Información de facturación</li>
                <li>Datos de las etiquetas creadas</li>
                <li>Información de uso del servicio</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Uso de la Información</h2>
            <p>Utilizamos tu información para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar y mantener nuestro servicio</li>
              <li>Procesar tus pagos</li>
              <li>Enviarte información importante sobre el servicio</li>
              <li>Mejorar y personalizar tu experiencia</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tus datos personales contra el 
              acceso no autorizado, la modificación, divulgación o destrucción no autorizada.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Tus Derechos</h2>
            <p>Como usuario, tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Solicitar la portabilidad de tus datos</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. 
              Puedes controlar el uso de cookies a través de la configuración de tu navegador.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Compartir Información</h2>
            <p>
              No vendemos ni alquilamos tu información personal a terceros. Solo compartimos tu información con proveedores de 
              servicios que necesitan acceder a ella para proporcionar servicios en nuestro nombre (como procesamiento de pagos).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Cambios en esta Política</h2>
            <p>
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos cualquier cambio material 
              publicando la nueva política de privacidad y actualizando la fecha de "última actualización".
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tus datos personales, 
              por favor contáctanos a través de nuestro soporte.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
} 