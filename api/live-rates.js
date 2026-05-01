const TARGETS = ['MXN', 'GTQ', 'COP', 'DOP', 'HNL', 'NIO', 'PEN'];
const FALLBACK_RATES = {
  MXN: 17.18,
  GTQ: 7.74,
  COP: 4048,
  DOP: 59.4,
  HNL: 24.68,
  NIO: 36.6,
  PEN: 3.72,
};

async function fetchExchangeRateApi(apiKey) {
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
  if (!res.ok) throw new Error(`ExchangeRate-API HTTP ${res.status}`);
  const data = await res.json();
  if (data.result !== 'success' || !data.conversion_rates) {
    throw new Error('ExchangeRate-API bad payload');
  }

  const rates = {};
  TARGETS.forEach((code) => {
    if (typeof data.conversion_rates[code] === 'number') {
      rates[code] = data.conversion_rates[code];
    }
  });

  return {
    source: 'live',
    upstreamUpdatedAt: data.time_last_update_utc || null,
    fetchedAt: new Date().toISOString(),
    rates,
  };
}

async function fetchFrankfurter() {
  const res = await fetch('https://api.frankfurter.app/latest?from=USD');
  if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`);
  const data = await res.json();
  if (!data.rates) throw new Error('Frankfurter bad payload');

  const rates = {};
  TARGETS.forEach((code) => {
    if (typeof data.rates[code] === 'number') rates[code] = data.rates[code];
  });

  return {
    source: 'fallback',
    upstreamUpdatedAt: data.date || null,
    fetchedAt: new Date().toISOString(),
    rates,
  };
}

function withUsdRates(rates) {
  return {
    USD: 1,
    ...rates,
  };
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      ok: false,
      source: 'error',
      error: 'Missing EXCHANGE_RATE_API_KEY',
      rates: withUsdRates(FALLBACK_RATES),
      fetchedAt: new Date().toISOString(),
    });
    return;
  }

  try {
    const primary = await fetchExchangeRateApi(apiKey);
    res.status(200).json({
      ok: true,
      source: primary.source,
      fetchedAt: primary.fetchedAt,
      upstreamUpdatedAt: primary.upstreamUpdatedAt,
      rates: withUsdRates(primary.rates),
    });
    return;
  } catch (_) {
    try {
      const fallback = await fetchFrankfurter();
      const merged = { ...FALLBACK_RATES, ...fallback.rates };
      res.status(200).json({
        ok: true,
        source: fallback.source,
        fetchedAt: fallback.fetchedAt,
        upstreamUpdatedAt: fallback.upstreamUpdatedAt,
        rates: withUsdRates(merged),
      });
      return;
    } catch (_) {
      res.status(200).json({
        ok: true,
        source: 'error',
        fetchedAt: new Date().toISOString(),
        upstreamUpdatedAt: null,
        rates: withUsdRates(FALLBACK_RATES),
      });
    }
  }
}
