// Generates the illustrated SVG gallery / portrait images for all three themes.
// Run: npm run images   (output goes to public/img/<theme>/)
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as L from "lucide-react";

const themes = {
  dental: { file: "config/client.json", icons: [["Armchair", "Smile"], ["Stethoscope", "Sparkles"], ["ScanLine", "Zap"], ["ShieldCheck", "Droplets"], ["Baby", "Star"], ["Sparkles", "Smile"]], portrait: "Stethoscope" },
  coaching: { file: "config/themes/coaching.json", icons: [["Presentation", "Users"], ["Calculator", "Pencil"], ["FlaskConical", "Microscope"], ["Library", "BookOpen"], ["Trophy", "Medal"], ["Laptop", "BarChart3"]], portrait: "GraduationCap" },
  property: { file: "config/themes/property.json", icons: [["Landmark", "Sunset"], ["Sofa", "Waves"], ["Building2", "Briefcase"], ["BedDouble", "Sun"], ["FileCheck", "KeyRound"], ["MapPin", "Compass"]], portrait: "Building2" },
};

const icon = (name, size, x, y, stroke, sw = 1.4, rot = 0) => {
  const Cmp = L[name] ?? L.Sparkles;
  const svg = renderToStaticMarkup(createElement(Cmp, { size, color: stroke, strokeWidth: sw }));
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  const s = size / 24;
  return `<g transform="translate(${x} ${y}) rotate(${rot} ${size / 2} ${size / 2})"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg></g>`;
};

function scene(colors, [main, sub], i, w = 800, h = 600) {
  const { primary, secondary, accent, bg } = colors;
  const flip = i % 2 === 0;
  const grads = [[primary, secondary], [secondary, primary], [accent, primary]];
  const [g1, g2] = grads[i % 3];
  const cx = w / 2, cy = h / 2 - 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<circle cx="${flip ? 120 : w - 120}" cy="100" r="150" fill="#fff" opacity=".08"/>
<circle cx="${flip ? w - 80 : 80}" cy="${h - 60}" r="190" fill="#fff" opacity=".07"/>
<path d="M0 ${h - 110} Q ${w / 3} ${h - 190} ${w / 2} ${h - 120} T ${w} ${h - 140} V ${h} H0 Z" fill="${bg}" opacity=".16"/>
<circle cx="${cx}" cy="${cy}" r="170" fill="${bg}" opacity=".95"/>
<circle cx="${cx}" cy="${cy}" r="196" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-dasharray="3 12"/>
${icon(main, 190, cx - 95, cy - 95, secondary, 1.3)}
<circle cx="${flip ? cx + 150 : cx - 150}" cy="${cy - 110}" r="52" fill="${accent}"/>
${icon(sub, 56, (flip ? cx + 150 : cx - 150) - 28, cy - 110 - 28, secondary, 1.8, flip ? 12 : -12)}
${[[90, 90, 18], [w - 110, 150, 12], [120, h - 120, 14], [w - 90, h - 90, 20]].map(([x, y, r]) => `<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z" fill="#fff" opacity=".8"/>`).join("")}
</svg>`;
}

function portrait(colors, name, w = 600, h = 720) {
  const { primary, secondary, accent, bg } = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${primary}" stop-opacity=".35"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<circle cx="300" cy="300" r="230" fill="${accent}" opacity=".25"/>
<path d="M90 ${h} C90 520 180 470 300 470 C420 470 510 520 510 ${h} Z" fill="${secondary}"/>
<path d="M255 470 L300 540 L345 470 Z" fill="#fff"/>
<rect x="268" y="400" width="64" height="80" rx="24" fill="#E8B796"/>
<ellipse cx="300" cy="320" rx="102" ry="118" fill="#F2C6A4"/>
<path d="M196 310 C190 200 250 180 300 180 C360 180 412 210 404 312 C390 262 360 238 300 238 C246 238 212 262 196 310Z" fill="#2B1B17"/>
<circle cx="262" cy="326" r="8" fill="#2B1B17"/><circle cx="338" cy="326" r="8" fill="#2B1B17"/>
<path d="M266 376 Q300 404 334 376" fill="none" stroke="#9C4B3B" stroke-width="7" stroke-linecap="round"/>
<ellipse cx="238" cy="362" rx="16" ry="10" fill="#F28B82" opacity=".5"/><ellipse cx="362" cy="362" rx="16" ry="10" fill="#F28B82" opacity=".5"/>
<circle cx="470" cy="150" r="58" fill="${primary}"/>
${icon(name, 70, 435, 115, "#fff", 1.6)}
</svg>`;
}

for (const [slug, t] of Object.entries(themes)) {
  const cfg = JSON.parse(readFileSync(t.file, "utf8"));
  const dir = `public/img/${slug}`;
  mkdirSync(dir, { recursive: true });
  t.icons.forEach((pair, i) => writeFileSync(`${dir}/gallery-${i + 1}.svg`, scene(cfg.colors, pair, i)));
  writeFileSync(`${dir}/about.svg`, portrait(cfg.colors, t.portrait));
  console.log("generated", slug);
}
