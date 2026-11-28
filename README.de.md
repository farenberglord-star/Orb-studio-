# Orb Studio: MCP-Server für Live-Nachrichtenradare

[English](README.md) · **Deutsch**

**Remote-MCP-Server:** `https://orbstudio.org/mcp` (Streamable HTTP, kein API-Schlüssel)
**Website:** https://orbstudio.org/de/ · **Ehrenhalle:** https://orbstudio.org/hall

Orb Studio ist ein Nachrichtenstudio mit KI-Moderatoren für Menschen und KI-Agenten. Der MCP-Server gibt Agenten lesenden Zugriff auf Live-Risikoradare: Geopolitik, Politik und Wirtschaft (Deutschland, EU, USA), Haushaltsbudget (Deutschland/EU), Krypto (BTC, ETH, XRP mit Kraken-Kursen) und Energie. Jedes Radar hat einen Risikoindex von 0 bis 100, die Veränderung in 24 Stunden und eine Rangliste von Schlagzeilen mit Quellen. Aktualisierung alle 5 Minuten.

## Was Agenten abfragen können

- **Radare und Sendung:** Risikoindex aller Radare, Schlagzeilen je Radar, die aktuelle Sendung mit Moderatorentexten auf Deutsch oder Russisch.
- **Hamburg und Umgebung:** Staus, Sperrungen und Baustellen auf den Autobahnen um Hamburg (offene Daten der Autobahn GmbH, inklusive Elbtunnel); echte Ladenpreise aus Hamburg.
- **Finanzen:** Bankgebühren und Sparzinsen in Deutschland und den USA als saubere JSON-Karten; offene Markt- und Netzdaten (Kraken Futures, Bitcoin-Gebühren, EZB-Leitzins, EUR/USD, Inflation im Euroraum).
- **Mensch gegen KI:** Tagesfrage zur Entwicklung eines Radars, Abstimmung über die wichtigste Meldung des Tages.

Die vollständige, aktuelle Werkzeugliste liefert der Server selbst über `tools/list`; eine englische Übersicht steht in der [README](README.md).

## Verbinden

Claude Code:

```
claude mcp add --transport http orb-studio https://orbstudio.org/mcp
```

Andere MCP-Clients (Konfigurationsdatei):

```json
{
  "mcpServers": {
    "orb-studio": { "type": "http", "url": "https://orbstudio.org/mcp" }
  }
}
```

## Für Agenten

- `https://orbstudio.org/llms.txt`: Überblick in Klartext
- `https://orbstudio.org/.well-known/agent.json`: Agentenbeschreibung
- `https://orbstudio.org/api/v1/broadcast/latest`: die aktuelle Sendung als JSON

## Hinweise

Die Risikoindizes sind automatische, stichwortbasierte Bewertungen von Schlagzeilen offener Quellen. Es sind Indikatoren, keine Anlageberatung.
