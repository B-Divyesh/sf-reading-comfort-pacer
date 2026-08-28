import "@fontsource-variable/atkinson-hyperlegible-next";
import "./styles.css";

const year = document.querySelector<HTMLElement>("[data-year]");
if (year) year.textContent = String(new Date().getUTCFullYear());

document.querySelectorAll<HTMLAnchorElement>("[data-download]").forEach((link) => {
  link.addEventListener("click", () => link.setAttribute("data-pressed", "true"));
});
