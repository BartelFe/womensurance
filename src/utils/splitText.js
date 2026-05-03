// Lightweight alternative to GSAP's premium SplitText.
// Splits a DOM element's textContent into spans for char/word animation.

export function splitChars(el) {
  if (!el) return [];
  const text = el.textContent;
  el.innerHTML = '';
  const chars = [];
  text.split('').forEach((ch) => {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    el.appendChild(span);
    chars.push(span);
  });
  return chars;
}

export function splitWords(el) {
  if (!el) return [];
  const text = el.textContent;
  el.innerHTML = '';
  const words = [];
  text.split(/(\s+)/).forEach((token) => {
    if (/^\s+$/.test(token)) {
      el.appendChild(document.createTextNode(token));
      return;
    }
    if (!token) return;
    const wrap = document.createElement('span');
    wrap.className = 'line-mask';
    wrap.style.display = 'inline-block';
    const inner = document.createElement('span');
    inner.className = 'word';
    inner.textContent = token;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    words.push(inner);
  });
  return words;
}
