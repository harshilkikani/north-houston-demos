// Unstyled client-side mechanics shared across sites. No markup, no classes, no colours —
// every site supplies its own DOM and CSS and wires these behaviours to it.

/** Traps Tab focus inside `el` until released. Returns a release function. */
export function trapFocus(el, restoreTo) {
  const sel =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
  const prev = restoreTo || document.activeElement
  function onKey(e) {
    if (e.key !== 'Tab') return
    const items = [...el.querySelectorAll(sel)].filter((n) => n.offsetParent !== null)
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
  el.addEventListener('keydown', onKey)
  const firstFocusable = el.querySelector(sel)
  if (firstFocusable) firstFocusable.focus()
  return () => {
    el.removeEventListener('keydown', onKey)
    if (prev && prev.focus) prev.focus()
  }
}

/** Wires a dialog element: Esc closes, focus is trapped and restored, scroll is locked. */
export function dialog(el, { onClose } = {}) {
  let release = null
  function open() {
    el.hidden = false
    document.documentElement.style.overflow = 'hidden'
    release = trapFocus(el)
    document.addEventListener('keydown', onEsc)
  }
  function close() {
    el.hidden = true
    document.documentElement.style.overflow = ''
    document.removeEventListener('keydown', onEsc)
    if (release) release()
    release = null
    if (onClose) onClose()
  }
  function onEsc(e) {
    if (e.key === 'Escape') close()
  }
  return { open, close }
}

/**
 * Two-image comparison slider. `root` needs a [data-clip] element and an <input type=range>.
 * Purely mechanical — every visual decision belongs to the site's CSS.
 */
export function compareSlider(root) {
  const clip = root.querySelector('[data-clip]')
  const range = root.querySelector('input[type=range]')
  if (!clip || !range) return
  const apply = () => {
    clip.style.setProperty('--pos', `${range.value}%`)
    root.style.setProperty('--pos', `${range.value}%`)
  }
  range.addEventListener('input', apply)
  apply()

  // dragging anywhere on the surface moves the handle
  let dragging = false
  const set = (clientX) => {
    const r = root.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100))
    range.value = String(Math.round(pct))
    apply()
  }
  root.addEventListener('pointerdown', (e) => {
    if (e.target === range) return
    dragging = true
    set(e.clientX)
  })
  window.addEventListener('pointermove', (e) => dragging && set(e.clientX))
  window.addEventListener('pointerup', () => (dragging = false))
}

/** Minimal field validation. Returns true when every [data-required] field in `form` is filled. */
export function validate(form) {
  let ok = true
  form.querySelectorAll('[data-required]').forEach((f) => {
    const empty = !String(f.value || '').trim()
    const bad = empty || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))
    f.setAttribute('aria-invalid', bad ? 'true' : 'false')
    const msg = form.querySelector(`[data-error-for="${f.id}"]`)
    if (msg) msg.hidden = !bad
    if (bad) ok = false
  })
  return ok
}

/**
 * Multi-step flow controller. Steps are [data-step] elements; `onRender(index)` lets the
 * site update its own progress UI. Nothing here transmits data anywhere (§18).
 */
export function steps(root, { onRender } = {}) {
  const panels = [...root.querySelectorAll('[data-step]')]
  let i = 0
  function render() {
    panels.forEach((p, n) => {
      p.hidden = n !== i
    })
    if (onRender) onRender(i, panels.length)
    const h = panels[i].querySelector('[data-step-focus]') || panels[i]
    if (h && h.focus) h.focus({ preventScroll: true })
  }
  return {
    next() {
      if (i < panels.length - 1) {
        i++
        render()
      }
    },
    back() {
      if (i > 0) {
        i--
        render()
      }
    },
    go(n) {
      i = Math.min(panels.length - 1, Math.max(0, n))
      render()
    },
    get index() {
      return i
    },
    render,
  }
}

/** Applies a language to the page: shows [data-l="<lang>"], hides the others. */
export function language(initial, onChange) {
  let cur = initial
  function apply(l) {
    cur = l
    document.documentElement.lang = l
    document.querySelectorAll('[data-l]').forEach((n) => {
      n.hidden = n.getAttribute('data-l') !== l
    })
    document.querySelectorAll('[data-lang-btn]').forEach((b) => {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-btn') === l ? 'true' : 'false')
    })
    if (onChange) onChange(l)
  }
  apply(cur)
  document.querySelectorAll('[data-lang-btn]').forEach((b) => {
    b.addEventListener('click', () => apply(b.getAttribute('data-lang-btn')))
  })
  return { get current() { return cur }, apply }
}
