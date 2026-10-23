import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { chromium } from '@playwright/test'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'
import { preview } from 'vite'

type Profile = 'mobile' | 'desktop'
type Category = 'performance' | 'accessibility' | 'best-practices' | 'seo'

interface AuditConfig {
  runs: number
  port: number
  outputDir: string
  profiles: Profile[]
  pages: { name: string; path: string }[]
  targets: Record<Category, number>
}

interface RunResult {
  scores: Record<Category, number>
  metrics: { lcp: number; cls: number; tbt: number }
  benchmarkIndex: number
}

const CATEGORIES: Category[] = ['performance', 'accessibility', 'best-practices', 'seo']

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

const config: AuditConfig = JSON.parse(await readFile('lighthouse.config.json', 'utf8'))
const outputDir = path.resolve(config.outputDir)
const chromePath = process.env.CHROME_PATH || chromium.executablePath()

await rm(outputDir, { recursive: true, force: true })

const server = await preview({ preview: { port: config.port, strictPort: true } })
const baseUrl = `http://localhost:${config.port}`

let lighthouseVersion = ''
let userAgent = ''
const summary: Record<string, Record<string, { median: RunResult; runs: RunResult[] }>> = {}

try {
  for (const profile of config.profiles) {
    summary[profile] = {}

    for (const page of config.pages) {
      const runs: RunResult[] = []
      const dir = path.join(outputDir, profile, page.name)
      await mkdir(dir, { recursive: true })

      for (let run = 1; run <= config.runs; run++) {
        const chrome = await chromeLauncher.launch({
          chromePath,
          chromeFlags: ['--headless=new', '--no-first-run'],
        })

        try {
          const result = await lighthouse(
            `${baseUrl}${page.path}`,
            { port: chrome.port, output: ['html', 'json'], logLevel: 'error', onlyCategories: CATEGORIES },
            profile === 'desktop' ? desktopConfig : undefined,
          )
          if (!result) throw new Error(`Lighthouse não retornou resultado para ${page.path}`)

          const { lhr, report } = result
          const [html, json] = report as string[]
          await writeFile(path.join(dir, `run-${run}.report.html`), html)
          await writeFile(path.join(dir, `run-${run}.report.json`), json)

          lighthouseVersion = lhr.lighthouseVersion
          userAgent = lhr.environment.hostUserAgent
          runs.push({
            scores: Object.fromEntries(
              CATEGORIES.map((c) => [c, Math.round((lhr.categories[c]?.score ?? 0) * 100)]),
            ) as Record<Category, number>,
            metrics: {
              lcp: lhr.audits['largest-contentful-paint'].numericValue ?? 0,
              cls: lhr.audits['cumulative-layout-shift'].numericValue ?? 0,
              tbt: lhr.audits['total-blocking-time'].numericValue ?? 0,
            },
            benchmarkIndex: lhr.environment.benchmarkIndex,
          })
          console.log(`[${profile}] ${page.name} #${run}:`, runs.at(-1)?.scores)
        } finally {
          chrome.kill()
        }
      }

      summary[profile][page.name] = {
        runs,
        median: {
          scores: Object.fromEntries(
            CATEGORIES.map((c) => [c, median(runs.map((r) => r.scores[c]))]),
          ) as Record<Category, number>,
          metrics: {
            lcp: median(runs.map((r) => r.metrics.lcp)),
            cls: median(runs.map((r) => r.metrics.cls)),
            tbt: median(runs.map((r) => r.metrics.tbt)),
          },
          benchmarkIndex: median(runs.map((r) => r.benchmarkIndex)),
        },
      }
    }
  }
} finally {
  await server.close()
}

const environment = {
  date: new Date().toISOString(),
  lighthouse: lighthouseVersion,
  chrome: userAgent,
  node: process.version,
  os: `${os.type()} ${os.release()} (${os.arch()})`,
  cpu: os.cpus()[0]?.model,
  runsPerPage: config.runs,
  server: 'vite preview (build otimizado, mocks ativos)',
}

await writeFile(
  path.join(outputDir, 'summary.json'),
  JSON.stringify({ environment, targets: config.targets, results: summary }, null, 2),
)

const lines = [
  '# Lighthouse — medianas',
  '',
  ...Object.entries(environment).map(([key, value]) => `- **${key}**: ${value}`),
  '',
  '| Perfil | Página | Performance | Accessibility | Best Practices | SEO | LCP (ms) | CLS | TBT (ms) |',
  '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
]
for (const [profile, pages] of Object.entries(summary)) {
  for (const [name, { median: m }] of Object.entries(pages)) {
    const score = (c: Category) => `${m.scores[c]}${m.scores[c] < config.targets[c] ? ' ⚠️' : ''}`
    lines.push(
      `| ${profile} | ${name} | ${CATEGORIES.map(score).join(' | ')} | ${Math.round(m.metrics.lcp)} | ${m.metrics.cls.toFixed(3)} | ${Math.round(m.metrics.tbt)} |`,
    )
  }
}
lines.push('', '⚠️ = abaixo da meta definida em `lighthouse.config.json`.', '')
await writeFile(path.join(outputDir, 'summary.md'), lines.join('\n'))

console.log(`\nRelatórios em ${path.relative(process.cwd(), outputDir)}/ (summary.md e summary.json)`)
