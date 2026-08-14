const toNumber = (val) => {
  if (val === null || val === undefined || val === '') return NaN;
  const normalized = String(val).replace(/[^\d.-]/g, '');
  return Number(normalized);
};

export const normalizeLabel = (label) =>
  String(label || '')
    .trim()
    .toLowerCase()
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .replace(/\s+/g, ' ');

/** Pull the first integer from labels like "115 Diamonds" or "60 UC". */
export const amountFromLabel = (label) => {
  const match = String(label || '').match(/(\d[\d,]*)/);
  return match ? toNumber(match[1]) : NaN;
};

export const resolvePackageIndex = (packages, selectedPackage) => {
  if (!Array.isArray(packages) || !packages.length || !selectedPackage) return -1;

  const wantedLabel = normalizeLabel(selectedPackage.label);
  const wantedAmount = toNumber(selectedPackage.amount);
  const wantedPrice = toNumber(selectedPackage.price);
  const labelAmount = amountFromLabel(selectedPackage.label);

  let index = packages.findIndex(
    (p) => normalizeLabel(p.label) === wantedLabel
  );
  if (index >= 0) return index;

  if (Number.isFinite(wantedAmount)) {
    index = packages.findIndex((p) => Number(p.amount) === wantedAmount);
    if (index >= 0) return index;
  }

  if (Number.isFinite(labelAmount)) {
    index = packages.findIndex((p) => Number(p.amount) === labelAmount);
    if (index >= 0) return index;
  }

  if (Number.isFinite(wantedPrice)) {
    index = packages.findIndex(
      (p) =>
        Number(p.price) === wantedPrice &&
        (!wantedLabel ||
          normalizeLabel(p.label).includes(wantedLabel.split(' ')[0]) ||
          wantedLabel.includes(normalizeLabel(p.label).split(' ')[0]))
    );
    if (index >= 0) return index;

    index = packages.findIndex((p) => Number(p.price) === wantedPrice);
    if (index >= 0) return index;
  }

  return -1;
};

export const resolvePackage = (packages, selectedPackage) => {
  const index = resolvePackageIndex(packages, selectedPackage);
  return {
    index,
    pkg: index >= 0 ? packages[index] : null,
  };
};
