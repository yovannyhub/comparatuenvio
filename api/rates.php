<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');

$targets = ['MXN', 'GTQ', 'COP', 'DOP', 'HNL', 'NIO', 'PEN'];
$fallbackRates = [
  'USD' => 1,
  'MXN' => 17.18,
  'GTQ' => 7.74,
  'COP' => 4048,
  'DOP' => 59.4,
  'HNL' => 24.68,
  'NIO' => 36.6,
  'PEN' => 3.72
];

function json_out($payload, $status = 200) {
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function fetch_json($url) {
  $ctx = stream_context_create([
    'http' => [
      'method' => 'GET',
      'timeout' => 15,
      'ignore_errors' => true
    ]
  ]);
  $raw = @file_get_contents($url, false, $ctx);
  if ($raw === false) return null;
  $json = json_decode($raw, true);
  return is_array($json) ? $json : null;
}

$apiKey = getenv('EXCHANGE_RATE_API_KEY');
if (!$apiKey) {
  json_out([
    'ok' => false,
    'source' => 'error',
    'error' => 'Missing EXCHANGE_RATE_API_KEY',
    'fetchedAt' => gmdate('c'),
    'rates' => $fallbackRates
  ], 500);
}

// Primary: ExchangeRate-API
$primaryUrl = "https://v6.exchangerate-api.com/v6/{$apiKey}/latest/USD";
$primary = fetch_json($primaryUrl);
if ($primary && isset($primary['result']) && $primary['result'] === 'success' && isset($primary['conversion_rates'])) {
  $rates = ['USD' => 1];
  foreach ($targets as $code) {
    if (isset($primary['conversion_rates'][$code]) && is_numeric($primary['conversion_rates'][$code])) {
      $rates[$code] = (float)$primary['conversion_rates'][$code];
    }
  }
  json_out([
    'ok' => true,
    'source' => 'live',
    'fetchedAt' => gmdate('c'),
    'upstreamUpdatedAt' => $primary['time_last_update_utc'] ?? null,
    'rates' => $rates + $fallbackRates
  ]);
}

// Fallback: Frankfurter
$fallback = fetch_json('https://api.frankfurter.app/latest?from=USD');
if ($fallback && isset($fallback['rates']) && is_array($fallback['rates'])) {
  $rates = $fallbackRates;
  foreach ($targets as $code) {
    if (isset($fallback['rates'][$code]) && is_numeric($fallback['rates'][$code])) {
      $rates[$code] = (float)$fallback['rates'][$code];
    }
  }
  json_out([
    'ok' => true,
    'source' => 'fallback',
    'fetchedAt' => gmdate('c'),
    'upstreamUpdatedAt' => $fallback['date'] ?? null,
    'rates' => $rates
  ]);
}

// Last resort: static fallback
json_out([
  'ok' => true,
  'source' => 'error',
  'fetchedAt' => gmdate('c'),
  'upstreamUpdatedAt' => null,
  'rates' => $fallbackRates
]);

