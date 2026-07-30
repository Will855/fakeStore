export const DEFAULT_BCV_RATE = 742.81;

export async function fetchCurrentBCVRate() {
  // 1. Intentar API primaria: DolarApi Venezuela (Oficial BCV)
  try {
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const rate = parseFloat(data?.promedio);
      if (rate && rate > 0) {
        return rate;
      }
    }
  } catch (err) {
    console.warn('DolarApi no disponible, intentando mirror secundario:', err.message);
  }

  // 2. Intentar API secundaria (PyDolarVe Mirror)
  try {
    const res = await fetch('https://pydolarve.org/api/v1/dollar?page=bcv', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const rate = parseFloat(data?.monitors?.usd?.price || data?.price);
      if (rate && rate > 0) {
        return rate;
      }
    }
  } catch (err) {
    console.warn('PyDolarVe mirror no disponible:', err.message);
  }

  // 3. Fallback en caso de desconexión total
  return DEFAULT_BCV_RATE;
}
