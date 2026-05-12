import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Terra Construction",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-8">
          Aviso de Privacidad
        </h1>

        <div className="prose prose-stone max-w-none">
          <p className="text-stone-600 mb-6">
            Terra Construction, con domicilio en Av. Constituyentes 123, Centro,
            Querétaro, Qro. 76000, es responsable del tratamiento de sus datos personales.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            Datos personales que recabamos
          </h2>
          <p className="text-stone-600 mb-4">
            Para las finalidades señaladas en el presente aviso de privacidad, podemos
            recabar sus datos personales de distintas formas: cuando usted nos los
            proporciona directamente, cuando visita nuestro sitio web o utiliza nuestros
            servicios en línea, y cuando obtenemos información a través de otras fuentes
            permitidas por la ley.
          </p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
            <li>Nombre completo</li>
            <li>Teléfono y correo electrónico</li>
            <li>Información laboral y financiera (para trámites de crédito)</li>
            <li>Identificación oficial</li>
            <li>Dirección</li>
          </ul>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            Finalidades del tratamiento
          </h2>
          <p className="text-stone-600 mb-4">
            Sus datos personales serán utilizados para las siguientes finalidades:
          </p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
            <li>Contactarlo para dar seguimiento a sus solicitudes de información</li>
            <li>Elaborar cotizaciones y propuestas personalizadas</li>
            <li>Realizar trámites de crédito hipotecario</li>
            <li>Formalizar contratos de compraventa</li>
            <li>Envío de información promocional (si autoriza)</li>
          </ul>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            Derechos ARCO
          </h2>
          <p className="text-stone-600 mb-6">
            Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué
            los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es
            su derecho solicitar la corrección de su información personal en caso de que
            esté desactualizada, sea inexacta o incompleta (Rectificación); que la
            eliminemos de nuestros registros cuando considere que la misma no está siendo
            utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos
            personales para fines específicos (Oposición).
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            Contacto
          </h2>
          <p className="text-stone-600">
            Para ejercer sus derechos ARCO o revocar su consentimiento, puede contactarnos
            a través del correo electrónico: privacidad@terraconstruction.com
          </p>
        </div>
      </div>
    </div>
  );
}
