# CEO: Build or Bust

**Start small. Make smart choices. Build a business your way.**

A single-player offline CEO / business simulation. You found a company, hire a team, ship products, and try to reach a billion-dollar valuation without running out of cash.

This is the **offline edition**. The entire game runs in the browser. There is no backend, no account, and no server-side game state.

## Designed for more players

CEO: Build or Bust is built to be approachable whether this is your first business game or your hundredth:

- **Guided first run:** a six-step tutorial explains the core systems in plain language.
- **Next-step coaching:** the dashboard recommends a useful action based on the current state of the company.
- **Quick actions:** jump straight to your team, products, or finances.
- **A living office:** a lightweight animated office scene makes the company feel active.
- **Comfort settings:** larger text, extra contrast, and reduced animation can be switched on before or during a game.
- **Responsive layout:** the interface adapts to desktop and mobile screens.
- **Private local progress:** saves stay in the browser unless you export them.

## About

You start with limited cash, one employee, modest reputation, and no products. Each turn is one week. Revenue, expenses, customers, morale, competitors, and the market all move. Random business events force decisions that are rarely free.

Industries are not cosmetic. Technology spends more to build but researches faster. Gaming goes viral and then whiplashes. AI inflates valuation and burns research budgets. E-commerce sells hard and pays for it in operating cost.

## Features

- Company founding with seven distinct industries
- Weekly simulation with reports, auto-play, and pause
- Dashboard with live cash, profit, customers, valuation, and canvas charts
- Employees: hire, train, raise, promote, fire — skill, morale, and stress change output
- Products with a full lifecycle (idea → development → launch → growth → maturity → decline)
- Marketing campaigns with uncertain outcomes, including virality
- Finance: cash flow, burn, runway, loans, treasury investment
- Research projects with permanent bonuses
- Office, servers, infrastructure, automation, marketing, R&D, and sales upgrades
- 35+ random events with real mechanical effects
- Dynamic market states (boom through crisis)
- Eight AI competitors and a valuation leaderboard
- Reputation, churn, customer acquisition
- Cash warnings and bankruptcy with a full post-mortem
- Valuation milestones through $1B (the game does not end at unicorn)
- Achievements, news feed, statistics
- localStorage autosave, manual save/load, JSON export/import, reset

## Gameplay

1. **New Game** — name the company, name the CEO, pick an industry.
2. **Build something** — you have no revenue until a product launches. Create an idea, fund development, then launch.
3. **Hire with intent** — developers and designers raise quality, marketers and sales grow users, researchers speed the lab, HR protects morale, finance trims waste, managers lift the floor.
4. **Watch the cash** — salaries, office, infrastructure, campaigns, and research all hit every week. Loans exist; they are not free.
5. **Advance time** — Next week, or auto-play 1 / 4 / 12 weeks. Events interrupt. A weekly report lands after each played week (or the last week of an auto-play burst).

Valuation is not cash. It is a function of annualized revenue, growth, profit, customers, reputation, products, market condition, and dilution.

## Getting started

Open `index.html` in a modern browser. That is the whole runtime.

```bash
git clone https://github.com/dranimalis/ceo-build-or-bust.git
cd ceo-build-or-bust
open index.html
```

On Linux you can use `xdg-open index.html`. Any static file server also works:

```bash
python3 -m http.server 8080
```

No build step. No npm. No environment variables.

## Save system

Progress is stored in `localStorage` under `ceo-build-or-bust-v1`.

The game writes after important actions, each weekly tick, events, and when the tab hides. A previous snapshot is kept as a backup key so bankruptcy can offer a load of the prior save.

**Continue** on the title screen restores the latest local save.

## Import / export

- **Export save** downloads the current state as JSON. Nothing is uploaded.
- **Import save** reads a JSON file in the browser, validates required fields (company, cash, week, employees, products), then applies it.
- Treat save files as local backups. They never leave the machine unless you copy them.

## Architecture

| Layer | Role |
| --- | --- |
| `index.html` | Screens (menu, setup, game), chrome, modal host |
| `style.css` | Dark terminal / dashboard design system, responsive layout |
| `script.js` | Game state, simulation, events, competitors, achievements, persistence, UI |

- **Game state** is one plain object: company, week, cash, staff, products, campaigns, research, upgrades, market, competitors, loans, history, flags, stats.
- **Simulation engine** ticks employees, research, products, campaigns, revenue, expenses, loans, market, competitors, then valuation.
- **UI** re-renders the active view and the top bar. Charts are canvas line/area plots with no libraries.
- **Persistence** is `JSON.stringify` into `localStorage`, with try/catch and import validation.
- **Events** are data: conditions, copy, and choice functions that mutate state.
- **Competitors** are simulated firms that grow, publish news, and can go bankrupt.
- **Achievements** are predicates checked after every week.

## Deployment

This is a static site.

`netlify.toml` publishes the project root with an empty build command. Drop the folder on Netlify, or connect the GitHub repository: pushes to `main` deploy automatically.

## Contributing

Issues and pull requests are welcome.

1. Keep the game offline — no network calls in simulation code.
2. If a control is visible, it must work. No placeholder buttons.
3. Prefer small, testable changes to economy numbers over silent difficulty cliffs.
4. Match the existing visual language: dark, restrained, no decorative emoji in chrome.

## License

MIT. See [LICENSE](LICENSE).
