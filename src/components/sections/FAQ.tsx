"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ as FAQType } from "@/lib/types";

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((d) => setFaqs(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-brand-600 uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-stone-600">
            Resolvemos tus dudas sobre el proceso de compra y nuestros servicios.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion className="space-y-3">
            {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white rounded-lg border border-stone-100 px-6 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left text-stone-800 hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-brand-500 shrink-0" />
                  <span className="font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-stone-600 pb-5 pl-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
