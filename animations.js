const revealTargets = [
  "#about .about-lede",
  "#about .about-feature p",
  "#software .section-lede",
  "#software .software-card p:not(.software-meta)",
  "#contact .contact-copy",
  "#contact .footer-copy"
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsRevealObserver = "IntersectionObserver" in window;

if (!prefersReducedMotion && supportsRevealObserver) {
  document.documentElement.classList.add("has-paragraph-effects");

  const paragraphs = [...document.querySelectorAll(revealTargets.join(", "))];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.2
    }
  );

  paragraphs.forEach((paragraph, index) => {
    const text = paragraph.textContent.trim();
    if (!text) return;

    paragraph.classList.add("paragraph-reveal");
    paragraph.style.setProperty("--paragraph-delay", `${Math.min(index % 3, 2) * 90}ms`);
    paragraph.setAttribute("aria-label", text);
    paragraph.textContent = "";

    let wordIndex = 0;

    text.split(/(\s+)/).forEach((token) => {
      if (/^\s+$/.test(token)) {
        paragraph.append(document.createTextNode(token));
        return;
      }

      const word = document.createElement("span");
      word.className = "reveal-word";
      word.setAttribute("aria-hidden", "true");
      word.style.setProperty("--word-index", wordIndex);
      word.textContent = token;
      paragraph.append(word);
      wordIndex += 1;
    });

    observer.observe(paragraph);
  });
}
