// Brings the display type down a register across the portfolio. The headlines were sized for
// poster impact; a local business site reads better a good deal quieter.
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..', 'sites')

const CHANGES = {
  '01-countertops-of-texas': [
    ['.d-xl { font-size: clamp(44px, 9.2vw, 132px); }', '.d-xl { font-size: clamp(32px, 5.8vw, 74px); }'],
    ['.d-lg { font-size: clamp(32px, 5.4vw, 68px); }', '.d-lg { font-size: clamp(26px, 3.8vw, 46px); }'],
    ['.d-md { font-size: clamp(24px, 3.4vw, 40px); }', '.d-md { font-size: clamp(21px, 2.6vw, 31px); }'],
  ],
  '02-dd-granite': [
    ['.h1 { font-size: clamp(34px, 5.6vw, 66px); }', '.h1 { font-size: clamp(29px, 4.4vw, 52px); }'],
    ['.h2 { font-size: clamp(27px, 3.6vw, 44px); }', '.h2 { font-size: clamp(24px, 3vw, 36px); }'],
  ],
  '03-sosa-hardwood-floors': [
    ['.h1 { font-size: clamp(36px, 6.4vw, 82px); }', '.h1 { font-size: clamp(30px, 4.8vw, 58px); }'],
    ['.h2 { font-size: clamp(27px, 3.8vw, 48px); }', '.h2 { font-size: clamp(24px, 3vw, 37px); }'],
  ],
  '04-richey-collision': [
    ['.h1 { font-size: clamp(40px, 8vw, 108px); font-weight: 600; }', '.h1 { font-size: clamp(32px, 5.4vw, 68px); font-weight: 600; }'],
    ['.h2 { font-size: clamp(28px, 4.2vw, 58px); }', '.h2 { font-size: clamp(25px, 3.2vw, 42px); }'],
  ],
  '05-la-tino-hair': [
    ['.h1 { font-size: clamp(42px, 7.2vw, 96px); }', '.h1 { font-size: clamp(33px, 5vw, 62px); }'],
    ['.h2 { font-size: clamp(30px, 4.2vw, 56px); }', '.h2 { font-size: clamp(25px, 3.2vw, 40px); }'],
  ],
  '06-cutmasters': [
    ['.h1 { font-size: clamp(34px, 5.6vw, 68px); }', '.h1 { font-size: clamp(29px, 4.4vw, 52px); }'],
    ['.h2 { font-size: clamp(26px, 3.5vw, 44px); }', '.h2 { font-size: clamp(23px, 2.9vw, 35px); }'],
  ],
  '07-latin-cuts': [
    ['.h1 { font-size: clamp(44px, 12vw, 152px); }', '.h1 { font-size: clamp(32px, 6.4vw, 78px); }'],
    ['.h2 { font-size: clamp(32px, 6vw, 78px); }', '.h2 { font-size: clamp(25px, 3.6vw, 44px); }'],
  ],
  '08-marytere-image-salon': [
    ['.h1 { font-size: clamp(40px, 8vw, 82px); }', '.h1 { font-size: clamp(31px, 5vw, 56px); }'],
    ['.h2 { font-size: clamp(28px, 4.4vw, 50px); }', '.h2 { font-size: clamp(24px, 3.2vw, 38px); }'],
  ],
  '09-vnn-nails': [
    ['.h1 { font-size: clamp(40px, 8vw, 106px); }', '.h1 { font-size: clamp(32px, 5.4vw, 66px); }'],
    ['.h2 { font-size: clamp(28px, 4.4vw, 58px); }', '.h2 { font-size: clamp(24px, 3.2vw, 40px); }'],
  ],
  '10-cali-new-nails': [
    ['.h1 { font-size: clamp(36px, 5.6vw, 68px); letter-spacing: -.028em; }', '.h1 { font-size: clamp(30px, 4.4vw, 52px); letter-spacing: -.024em; }'],
    ['.h2 { font-size: clamp(26px, 3.4vw, 42px); }', '.h2 { font-size: clamp(23px, 2.9vw, 34px); }'],
  ],
}

let applied = 0
let missed = []
for (const [dir, pairs] of Object.entries(CHANGES)) {
  const f = path.join(ROOT, dir, 'src', 'styles', 'site.css')
  let css = readFileSync(f, 'utf8')
  for (const [from, to] of pairs) {
    if (!css.includes(from)) { missed.push(`${dir} :: ${from}`); continue }
    css = css.replace(from, to)
    applied++
  }
  writeFileSync(f, css)
}
console.log('replacements applied:', applied)
if (missed.length) { console.log('NOT FOUND:'); missed.forEach((m) => console.log('  ' + m)) }
