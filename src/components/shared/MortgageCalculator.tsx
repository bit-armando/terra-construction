"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  price: number;
}

const creditOptions = [
  { value: "infonavit", label: "INFONAVIT", rate: 0.04, maxYears: 30 },
  { value: "fovissste", label: "FOVISSSTE", rate: 0.06, maxYears: 25 },
  { value: "bancario", label: "Bancario", rate: 0.09, maxYears: 20 },
  { value: "cofinavit", label: "Cofinavit", rate: 0.07, maxYears: 25 },
];

export function MortgageCalculator({ price }: Props) {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.1));
  const [creditType, setCreditType] = useState("infonavit");
  const [years, setYears] = useState(20);

  const credit = creditOptions.find((c) => c.value === creditType);
  const rate = credit?.rate || 0.04;

  const monthlyPayment = useMemo(() => {
    const loanAmount = price - downPayment;
    const monthlyRate = rate / 12;
    const totalPayments = years * 12;

    if (loanAmount <= 0) return 0;

    const payment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    return Math.round(payment);
  }, [price, downPayment, rate, years]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="w-5 h-5 text-brand-500" />
        <h3 className="font-semibold text-stone-900">
          Calcula tu mensualidad
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-stone-600">Enganche</Label>
          <Input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="mt-1"
          />
          <p className="text-xs text-stone-400 mt-1">
            Monto a financiar: {formatCurrency(price - downPayment)}
          </p>
        </div>

        <div>
          <Label className="text-sm text-stone-600">Tipo de crédito</Label>
          <Select value={creditType} onValueChange={(v) => v && setCreditType(v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {creditOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} (~{(opt.rate * 100).toFixed(0)}% anual)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-stone-600">
            Plazo: {years} años
          </Label>
          <input
            type="range"
            min={5}
            max={credit?.maxYears || 30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full mt-2 accent-brand-600"
          />
          <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>5 años</span>
            <span>{credit?.maxYears || 30} años</span>
          </div>
        </div>

        <div className="bg-brand-50 rounded-lg p-4 text-center">
          <p className="text-sm text-stone-600 mb-1">Mensualidad estimada</p>
          <p className="text-3xl font-bold text-brand-700">
            {formatCurrency(monthlyPayment)}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            *Estimación aproximada. Consulta con tu asesor.
          </p>
        </div>
      </div>
    </div>
  );
}
