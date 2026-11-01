export function formatNumber(num, maxDecimals = 2) {
  if (Number.isInteger(num)) return num.toString();
  const rounded = parseFloat(num.toFixed(maxDecimals));
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(maxDecimals);
}

export function formatPoint({ x, y }) {
  return `(${formatNumber(x)}, ${formatNumber(y)})`;
}

function formatShiftTerm(variable, value) {
  if (value === 0) return `${variable}²`;
  const sign = value > 0 ? '-' : '+';
  const absVal = Math.abs(value);
  return `(${variable} ${sign} ${formatNumber(absVal)})²`;
}

export function formatStandardEquation({ h, k, a, b, orientation }) {
  const xTerm = formatShiftTerm('x', h);
  const yTerm = formatShiftTerm('y', k);
  const a2 = formatNumber(a * a);
  const b2 = formatNumber(b * b);

  if (orientation === 'horizontal') {
    return `${xTerm} / ${a2}  -  ${yTerm} / ${b2} = 1`;
  }
  return `${yTerm} / ${a2}  -  ${xTerm} / ${b2} = 1`;
}

export function formatGeneralEquation(generalForm) {
  const { A, C, D, E, F } = generalForm;
  const parts = [];

  const appendTerm = (coeff, varName, isFirst = false) => {
    if (coeff === 0) return;
    const rounded = parseFloat(coeff.toFixed(2));
    if (rounded === 0) return;

    const absVal = Math.abs(rounded);
    const sign = rounded > 0 ? (isFirst ? '' : '+ ') : (isFirst ? '-' : '- ');
    const numPart = (absVal === 1 && varName !== '') ? '' : formatNumber(absVal);

    parts.push(`${sign}${numPart}${varName}`.trim());
  };

  appendTerm(A, 'x²', parts.length === 0);
  appendTerm(C, 'y²', parts.length === 0);
  appendTerm(D, 'x', parts.length === 0);
  appendTerm(E, 'y', parts.length === 0);
  appendTerm(F, '', parts.length === 0);

  if (parts.length === 0) return '0 = 0';
  return `${parts.join(' ')} = 0`;
}

export function formatAsymptoteEquations({ h, k, a, b, orientation }) {
  const slopeVal = orientation === 'horizontal' ? b / a : a / b;
  const mStr = formatNumber(slopeVal);

  const formatLine = (sign) => {
    const m = sign * slopeVal;
    const intercept = k - m * h;
    const mDisplay = sign > 0 ? mStr : `-${mStr}`;

    if (intercept === 0) {
      return `y = ${mDisplay}x`;
    }
    const intSign = intercept > 0 ? '+' : '-';
    return `y = ${mDisplay}x ${intSign} ${formatNumber(Math.abs(intercept))}`;
  };

  return {
    positive: formatLine(1),
    negative: formatLine(-1),
    pointSlope: orientation === 'horizontal'
      ? `(y - ${formatNumber(k)}) = ± (${formatNumber(b)}/${formatNumber(a)})(x - ${formatNumber(h)})`
      : `(y - ${formatNumber(k)}) = ± (${formatNumber(a)}/${formatNumber(b)})(x - ${formatNumber(h)})`
  };
}
