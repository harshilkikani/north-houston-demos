// Drives each site's demo feature end to end, the way the operator will in front of the owner.
// Every step asserts a visible result — this is the evidence behind "the demo moment works".
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { serve } from './server.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const only = process.argv.slice(2)
const browser = await chromium.launch()
let failures = 0

const ok = (list, label, cond, detail = '') => {
  list.push(`${cond ? 'ok  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`)
  if (!cond) failures++
}

const FLOWS = {
  '01': async (p, r) => {
    await p.click('.profiles button[data-p="ogee"]')
    ok(r, 'edge studio switches profile', (await p.textContent('#edge-name')) === 'OGEE')
    ok(r, 'edge drawing swaps', (await p.getAttribute('#edges path[data-e="ogee"]', 'opacity')) === '1')
    await p.click('#use-edge')
    ok(r, 'profile carries into quote', (await p.getAttribute('[data-g="edge"][aria-pressed="true"]', 'aria-pressed')) === 'true' &&
      (await p.textContent('[data-g="edge"][aria-pressed="true"]')).trim() === 'Ogee')
    await p.fill('#q-name', 'Test'); await p.fill('#q-phone', '555')
    await p.click('#quote-form button[type=submit]')
    ok(r, 'quote confirmation shows', await p.isVisible('#quote-done'))
    ok(r, 'confirmation carries the edge', (await p.textContent('#d-edge')).trim() === 'Ogee')
  },
  '02': async (p, r) => {
    await p.click('.filt[data-cat="Quartz"]')
    const shown = await p.$$eval('.slab', (n) => n.filter((x) => !x.hidden).map((x) => x.dataset.cat))
    ok(r, 'filter narrows the wall', shown.length > 0 && shown.every((c) => c === 'Quartz'), `${shown.length} tiles`)
    await p.click('.slab:not([hidden])')
    ok(r, 'lightbox opens', await p.isVisible('#lb'))
    await p.click('#lb-add')
    ok(r, 'slab attaches to quote', await p.isVisible('#picked'))
    await p.fill('#q-name', 'Test'); await p.fill('#q-phone', '555')
    await p.click('#qf button[type=submit]')
    ok(r, 'quote confirmation shows', await p.isVisible('#qd'))
    ok(r, 'confirmation names the slab', !(await p.textContent('#d-slab')).includes('Not selected'))
  },
  '03': async (p, r) => {
    const before = await p.getAttribute('[data-clip]', 'style')
    await p.locator('#ba input[type=range]').fill('22')
    await p.waitForTimeout(150)
    ok(r, 'comparison slider moves', (await p.getAttribute('[data-clip]', 'style')) !== before)
    await p.click('#add-room')
    ok(r, 'scope builder adds a room', (await p.$$('.roomrow')).length === 3)
    await p.fill('#e-name', 'Test'); await p.fill('#e-phone', '555')
    await p.click('#ef button[type=submit]')
    ok(r, 'estimate confirmation shows', await p.isVisible('#ed'))
    ok(r, 'scope sheet is itemised', (await p.$$('#sum2 div')).length >= 3)
  },
  '04': async (p, r) => {
    await p.fill('#v-make', 'Chevrolet'); await p.fill('#v-model', 'Corvette')
    await p.click('[data-step]:not([hidden]) [data-next]')
    ok(r, 'step 2 opens', await p.isVisible('.diagram'))
    await p.click('.panel[data-p="Hood"]'); await p.click('.panel[data-p="Rear bumper"]')
    ok(r, 'car diagram records panels', (await p.textContent('#sel-out')).includes('Hood'))
    await p.click('[data-step]:not([hidden]) [data-next]')
    await p.fill('#c-name', 'Test'); await p.fill('#c-phone', '555')
    await p.click('#ef button[type=submit]')
    ok(r, 'estimate confirmation shows', await p.isVisible('#done'))
    ok(r, 'reference code generated', /^RC-\d{6}$/.test((await p.textContent('#ref')).trim()))
    ok(r, 'damage listed on receipt', (await p.textContent('#d-dmg')).includes('Hood'))
  },
  '05': async (p, r) => {
    await p.click('[data-lang-btn="es"]')
    ok(r, 'page switches to Spanish', (await p.getAttribute('html', 'lang')) === 'es')
    ok(r, 'Spanish copy visible', (await p.textContent('body')).includes('Reservar'))
    await p.click('[data-lang-btn="en"]')
    ok(r, 'page switches back', (await p.getAttribute('html', 'lang')) === 'en')
    await p.click('[data-step]:not([hidden]) [data-next]')
    ok(r, 'summary names the stylist, not the small print', (await p.textContent('#s-who')).trim() === 'Ivonne',
      `got "${(await p.textContent('#s-who')).trim()}"`)
    await p.click('[data-step]:not([hidden]) [data-next]')
    await p.click('#slots .slot:not([disabled])')
    ok(r, 'time slot selects', (await p.$$('.slot[aria-pressed="true"]')).length === 1)
    await p.click('[data-step]:not([hidden]) [data-next]')
    await p.fill('#b-name', 'Test'); await p.fill('#b-phone', '555')
    await p.click('#bf button[type=submit]')
    ok(r, 'booking confirmation shows', await p.isVisible('#confirm'))
    ok(r, 'confirmation has a time', (await p.textContent('#c-when')).trim() !== '—')
  },
  '06': async (p, r) => {
    await p.click('.member[data-member="Angie"]')
    ok(r, 'stylist card pre-fills booking', (await p.getAttribute('[data-g="who"][aria-pressed="true"]', 'data-name')) === 'Angie')
    ok(r, 'recap shows the stylist', (await p.textContent('#r-who')).trim() === 'Angie')
    await p.click('[data-g="who"][data-name="Anyone"]')
    ok(r, '"anyone available" labels correctly', (await p.textContent('#r-who')).trim() === 'Anyone available',
      `got "${(await p.textContent('#r-who')).trim()}"`)
    await p.click('.member[data-member="Angie"]')
    await p.click('[data-step]:not([hidden]) [data-next]')
    await p.click('#slots .slot:not([disabled])')
    await p.click('[data-step]:not([hidden]) [data-next]')
    await p.fill('#b-name', 'Test'); await p.fill('#b-phone', '555')
    await p.click('#bf button[type=submit]')
    ok(r, 'booking confirmation shows', await p.isVisible('#yay'))
    ok(r, 'confirmation keeps the stylist', (await p.textContent('#y-who')).trim() === 'Angie')
  },
  '07': async (p, r) => {
    ok(r, 'opens in Spanish', (await p.getAttribute('html', 'lang')) === 'es')
    await p.fill('#q-name', 'Marco T')
    await p.click('.qrow button[data-take]')
    ok(r, 'slot is claimed on the board', (await p.$$('.qrow.mine')).length === 1)
    ok(r, 'claimed row shows the name', (await p.textContent('.qrow.mine')).includes('Marco T'))
    await p.click('#qf button[type=submit]')
    ok(r, 'queue confirmation shows', await p.isVisible('#claimed'))
    ok(r, 'position ahead is calculated', /^\d+$/.test((await p.textContent('#c-ahead')).trim()))
    await p.click('[data-lang-btn="en"]')
    ok(r, 'switches to English', (await p.getAttribute('html', 'lang')) === 'en')
  },
  '08': async (p, r) => {
    await p.click('.look-item[data-look="look-curls"]')
    ok(r, 'look attaches to the reservation', await p.isVisible('#chosen'))
    ok(r, 'look is named', (await p.textContent('#chosen-name')).trim().length > 0)
    await p.click('#slots .slot:not([disabled])')
    await p.fill('#r-name', 'Test'); await p.fill('#r-phone', '555')
    await p.click('#rf button[type=submit]')
    ok(r, 'reservation confirmation shows', await p.isVisible('#done'))
    ok(r, 'confirmation keeps the look', (await p.textContent('#d-look')).trim() !== 'Not specified')
  },
  '09': async (p, r) => {
    const start = (await p.textContent('#total')).trim()
    await p.click('[data-g="len"] >> nth=2')
    await p.click('[data-g="art"] >> nth=4')
    await p.click('[data-add] >> nth=0')
    const end = (await p.textContent('#total')).trim()
    ok(r, 'price builder totals live', start !== end, `${start} -> ${end}`)
    // full set 45 + long 10 + custom freehand 30 + chrome 8
    ok(r, 'total is arithmetically right', end === '$93', `expected $93, got ${end}`)
    await p.fill('#b-name', 'Test'); await p.fill('#b-phone', '555')
    await p.click('#bf button[type=submit]')
    ok(r, 'booking confirmation shows', await p.isVisible('#booked-in'))
    ok(r, 'quoted price carried through', (await p.textContent('#b-total')).trim() === end)
  },
  '10': async (p, r) => {
    const free = await p.$$('.slot:not([disabled])')
    ok(r, 'two-chair board renders open times', free.length > 0, `${free.length} open`)
    await free[0].click()
    ok(r, 'time selects', (await p.$$('.slot[aria-pressed="true"]')).length === 1)
    ok(r, 'panel echoes the choice', !(await p.textContent('#picked-note')).includes('Select a time'))
    await p.fill('#r-name', 'Test'); await p.fill('#r-phone', '555')
    await p.click('#rf button[type=submit]')
    ok(r, 'reservation confirmation shows', await p.isVisible('#done'))
    ok(r, 'chair and time recorded', (await p.textContent('#d-chair')).includes('Chair'))
  },
}

for (const s of cfg.sites) {
  if (only.length && !only.includes(s.id)) continue
  const srv = await serve(path.join(ROOT, 'sites', s.dir, 'dist'), `/${cfg.repo}/${s.segment}`)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } })
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  const results = []
  try {
    await page.goto(srv.url, { waitUntil: 'networkidle' })
    await FLOWS[s.id](page, results)
  } catch (e) {
    results.push(`FAIL threw — ${e.message.split('\n')[0]}`)
    failures++
  }
  if (errs.length) { results.push(`FAIL js error — ${errs[0]}`); failures++ }
  console.log(`\n[${s.id} ${s.segment}]`)
  results.forEach((x) => console.log('   ' + x))
  await ctx.close(); srv.close()
}

await browser.close()
console.log(`\nINTERACTION FAILURES: ${failures}`)
if (failures) process.exitCode = 1
