export const brl = (value: number): string =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const installment = (value: number, parts = 6): string =>
  `${parts}x de ${brl(value / parts)} sem juros`;

export const discountPercent = (price: number, oldPrice?: number): number => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};
