export default function formatNumberToCurrency(
  number: string | number,
  removeCurrencySign = false
): string | undefined {
  number = Number(number);

  if (!number || isNaN(number)) return undefined;

  const opt = {
    cur: { style: "currency", currency: "RUB", maximumFractionDigits: 0 },
    number: { maximumFractionDigits: 0 }
  };

  const intl = new Intl.NumberFormat(
    "ru-RU",
    opt[removeCurrencySign ? "number" : "cur"]
  );

  return intl.format(number);
}
