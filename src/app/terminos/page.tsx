import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Terra Construction",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-8">
          Términos y Condiciones
        </h1>

        <div className="prose prose-stone max-w-none">
          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            1. Uso del sitio web
          </h2>
          <p className="text-stone-600 mb-4">
            Al acceder y utilizar este sitio web, usted acepta cumplir con estos términos
            y condiciones. Si no está de acuerdo con alguna parte de estos términos, le
            solicitamos no utilizar nuestro sitio.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            2. Información del sitio
          </h2>
          <p className="text-stone-600 mb-4">
            La información contenida en este sitio, incluyendo precios, características
            de los modelos, amenidades y disponibilidad, está sujeta a cambio sin previo
            aviso. Las imágenes mostradas son representativas y pueden variar respecto al
            producto final. Para información actualizada, contacte directamente a nuestros
            asesores.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            3. Propiedad intelectual
          </h2>
          <p className="text-stone-600 mb-4">
            Todo el contenido de este sitio web, incluyendo textos, imágenes, logotipos,
            diseños y código, es propiedad de Terra Construction o de sus licenciantes
            y está protegido por las leyes de propiedad intelectual.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            4. Cotizaciones y reservas
          </h2>
          <p className="text-stone-600 mb-4">
            Las cotizaciones generadas a través de este sitio son informativas y no
            constituyen una oferta firme. Las reservas están sujetas a disponibilidad y
            requieren confirmación por escrito. El monto de apartado puede variar según
            el desarrollo y modelo seleccionado.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            5. Limitación de responsabilidad
          </h2>
          <p className="text-stone-600 mb-4">
            Terra Construction no se hace responsable por daños directos, indirectos,
            incidentales o consecuenciales derivados del uso o incapacidad de uso de este
            sitio web o de la información contenida en él.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-4">
            6. Modificaciones
          </h2>
          <p className="text-stone-600">
            Nos reservamos el derecho de modificar estos términos y condiciones en
            cualquier momento. Las modificaciones entrarán en vigor desde su publicación
            en el sitio. Le recomendamos revisar periódicamente esta sección.
          </p>
        </div>
      </div>
    </div>
  );
}
