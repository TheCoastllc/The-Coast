/** Split an element's content into word units for masked per-word reveals.
 *  Markup-safe: element children (em, span accents) are treated as single
 *  word units and keep their styling. Each word gets an overflow-hidden
 *  wrapper + an inner span the animation drives. Returns the inner spans. */
export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "1") {
    return Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
  }
  const inners: HTMLElement[] = [];
  const wrapWord = (content: Node): HTMLElement => {
    const outer = document.createElement("span");
    outer.style.display = "inline-block";
    outer.style.overflow = "hidden";
    outer.style.verticalAlign = "bottom";
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.dataset.word = "1";
    inner.appendChild(content);
    outer.appendChild(inner);
    inners.push(inner);
    return outer;
  };
  const nodes = Array.from(el.childNodes);
  el.textContent = "";
  nodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const parts = (n.textContent ?? "").split(/(\s+)/);
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(" "));
        } else {
          el.appendChild(wrapWord(document.createTextNode(part)));
        }
      });
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      el.appendChild(wrapWord(n));
    }
  });
  el.dataset.split = "1";
  return inners;
}
