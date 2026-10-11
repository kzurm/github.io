/* Inline SVG icons (stroke based, inherit text colour) and flat produce
   illustrations for the week-by-week size card. */
window.BUMP = window.BUMP || {};
(function () {
  var P = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    log: '<path d="M9 4h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M9 2h6v4H9z"/><path d="M10 12h4M10 16h4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    pill: '<path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7z"/><path d="M8.5 8.5l7 7"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.5 5-6.5"/>',
    move: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .8-4.5 2.5C10.5 3.8 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M15.1 14a5 5 0 0 0 1.9-4 5 5 0 0 0-10 0 5 5 0 0 0 1.9 4c.6.5 1.1 1.3 1.1 2v.5h4V16c0-.7.5-1.5 1.1-2z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>',
    baby: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01"/><path d="M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5"/><path d="M12 3c-1 1-1 2 0 3"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .4-9A7 7 0 0 0 4.3 12 4 4 0 0 0 6 19.5z"/><path d="M12 12v6M9 15l3-3 3 3"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    drop: '<path d="M12 2.7s-6 6.5-6 11.3a6 6 0 0 0 12 0c0-4.8-6-11.3-6-11.3z"/>',
    play: '<path d="m6 4 14 8-14 8z"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    scale: '<path d="M12 3v18M5 7l7-4 7 4"/><path d="M2 14l3-7 3 7a3 3 0 0 1-6 0zM16 14l3-7 3 7a3 3 0 0 1-6 0z"/>'
  };
  BUMP.icon = function (name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || P.info) + '</svg>';
  };

  /* Produce illustrations on a 64x64 canvas. Flat, two or three tones. */
  var leaf = function (x, y, r, c) { return '<path d="M' + x + ' ' + y + 'c' + r + ' -' + r + ' ' + (r * 2) + ' -' + (r * .6) + ' ' + (r * 2.2) + ' ' + (r * .2) + 'c-' + (r * .9) + ' ' + (r * 1.2) + ' -' + (r * 1.8) + ' ' + (r * .9) + ' -' + (r * 2.2) + ' -' + (r * .2) + 'z" fill="' + (c || '#6f9a6a') + '"/>'; };
  var stem = function (x, y, h) { return '<path d="M' + x + ' ' + y + 'q-1 -' + h / 2 + ' 2 -' + h + '" stroke="#6b4b2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>'; };
  var ART = {
    seed: '<circle cx="32" cy="36" r="6" fill="#4a3b36"/><circle cx="30" cy="34" r="1.6" fill="#8c7a73"/>',
    sesame: '<ellipse cx="32" cy="36" rx="5" ry="8" fill="#e9d9b8" stroke="#c9b48d" stroke-width="1.5"/>',
    lentil: '<circle cx="32" cy="36" r="10" fill="#d9893a"/><circle cx="32" cy="36" r="4" fill="none" stroke="#b86d26" stroke-width="2"/>',
    blueberry: '<circle cx="32" cy="36" r="17" fill="#4d5fa3"/><circle cx="26" cy="29" r="4" fill="#7d8ccb" opacity=".6"/><path d="M32 23l3 4h-6zM28 24l1 4-4-1zM36 24l-1 4 4-1z" fill="#2c3870"/>',
    raspberry: '<g fill="#c43c6a">' + [[32, 22], [24, 28], [40, 28], [32, 32], [20, 37], [44, 37], [27, 40], [37, 40], [32, 48]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6"/>'; }).join('') + '</g>' + leaf(26, 18, 5) + leaf(34, 18, 5),
    cherry: '<circle cx="24" cy="42" r="10" fill="#b8243f"/><circle cx="42" cy="40" r="10" fill="#d0304e"/>' + stem(24, 32, 16) + stem(42, 30, 14) + leaf(30, 15, 5),
    strawberry: '<path d="M32 56C18 48 14 36 16 28c3-8 11-9 16-4 5-5 13-4 16 4 2 8-2 20-16 28z" fill="#d93b4e"/><g fill="#f7d9a4">' + [[24, 32], [32, 30], [40, 32], [27, 40], [37, 40], [32, 48]].map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1.4" ry="2"/>'; }).join('') + '</g>' + leaf(26, 20, 6) + leaf(34, 20, 6) + '<path d="M32 14v8" stroke="#6f9a6a" stroke-width="2.5" stroke-linecap="round"/>',
    fig: '<path d="M32 10c-2 10-18 12-18 28a18 18 0 0 0 36 0c0-16-16-18-18-28z" fill="#6a3d7a"/><path d="M32 24c-6 3-10 8-10 16" stroke="#c98fd4" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>',
    citrus: function (c1, c2) { return '<circle cx="32" cy="34" r="20" fill="' + c1 + '"/><circle cx="32" cy="34" r="15" fill="' + c2 + '"/><g stroke="' + c1 + '" stroke-width="2">' + [0, 45, 90, 135].map(function (a) { return '<line x1="17" y1="34" x2="47" y2="34" transform="rotate(' + a + ' 32 34)"/>'; }).join('') + '</g>'; },
    peapod: '<path d="M10 40c6-14 22-24 44-26-2 22-16 32-30 32-8 0-12-3-14-6z" fill="#7fb069"/><g fill="#5a8f48">' + [[22, 36], [32, 30], [42, 24]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5"/>'; }).join('') + '</g>',
    peach: '<circle cx="32" cy="36" r="19" fill="#f2a05e"/><path d="M32 17v38" stroke="#e07a3f" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>' + leaf(32, 16, 6),
    apple: '<path d="M32 20c-4-4-10-4-14 0-6 6-5 18 2 28 3 4 6 5 9 3h6c3 2 6 1 9-3 7-10 8-22 2-28-4-4-10-4-14 0z" fill="#d6454d"/>' + stem(32, 20, 8) + leaf(33, 12, 5),
    avocado: '<path d="M32 8c-9 0-14 8-15 20-1 14 6 28 15 28s16-14 15-28C46 16 41 8 32 8z" fill="#6c9a4b"/><path d="M32 14c-6 0-10 7-11 17-1 11 4 20 11 20s12-9 11-20c-1-10-5-17-11-17z" fill="#dbe5a3"/><circle cx="32" cy="38" r="8" fill="#8d5a2b"/>',
    pepper: '<path d="M18 22c-6 4-6 26 0 32 3 3 8 2 10-2 2 4 7 4 9 0 2 4 7 5 10 2 6-6 6-28 0-32-3-2-7 0-9 3-2-3-6-3-8 0-3-3-8-5-12-3z" fill="#e2b33a"/>' + stem(32, 24, 10) + leaf(33, 15, 5),
    mango: '<path d="M18 22c8-10 24-10 30 0 6 10 0 28-14 32-8 2-18-2-22-10-3-7 1-16 6-22z" fill="#f0a830"/><path d="M26 24c6-4 14-4 18 2" stroke="#fbd27a" stroke-width="3" fill="none" stroke-linecap="round"/>' + leaf(18, 20, 6),
    banana: '<path d="M14 18c2 20 14 32 32 34 4 0 6-2 6-4-12-2-26-14-30-32-2-3-8-2-8 2z" fill="#f2cf4a"/><path d="M16 22c4 16 14 26 30 28" stroke="#d9b232" stroke-width="2" fill="none"/><path d="M12 16l3-5 4 2" stroke="#7a5a2a" stroke-width="3" stroke-linecap="round" fill="none"/>',
    carrot: '<path d="M30 20c-6 2-10 20-8 36l6 2c6-14 12-28 10-36-2-3-5-3-8-2z" fill="#ec8a3c"/><path d="M26 30h8M25 40h7" stroke="#d4702a" stroke-width="2" stroke-linecap="round"/><path d="M30 20c-2-6-8-8-12-8 2 4 6 8 10 8M32 18c0-6 4-10 8-12 0 5-2 10-6 12M34 18c4-4 10-4 14-2-4 2-8 4-12 4" fill="#6f9a6a"/>',
    corn: '<path d="M24 12h16c4 10 4 30 0 42H24c-4-12-4-32 0-42z" fill="#f3cc48"/><g fill="#e0b230">' + [18, 26, 34, 42, 50].map(function (y) { return '<circle cx="28" cy="' + y + '" r="2"/><circle cx="36" cy="' + y + '" r="2"/>'; }).join('') + '</g><path d="M22 20c-10 6-12 24-6 36 2-14 6-24 10-30zM42 20c10 6 12 24 6 36-2-14-6-24-10-30z" fill="#7fb069"/>',
    rutabaga: '<path d="M14 36c0-12 8-20 18-20s18 8 18 20c0 8-6 16-14 20h-8c-8-4-14-12-14-20z" fill="#e8d5b0"/><path d="M14 36c0-6 8-10 18-10s18 4 18 10" fill="#9b6aa8"/><path d="M30 16v-6M34 16v-7M32 16V7" stroke="#6f9a6a" stroke-width="3" stroke-linecap="round"/>',
    zucchini: '<rect x="12" y="20" width="44" height="26" rx="13" fill="#4e8a3e"/><path d="M18 26c10-4 20-4 30 0M18 40c10 4 20 4 30 0" stroke="#7fb069" stroke-width="2" fill="none" opacity=".6"/><path d="M52 30h6v6h-6z" fill="#8c6a3a"/>',
    cauliflower: '<g fill="#f1ecdf">' + [[32, 24, 12], [20, 32, 10], [44, 32, 10], [26, 42, 10], [38, 42, 10]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '"/>'; }).join('') + '</g><path d="M12 40c-4 8 4 18 20 18s24-10 20-18c-6 6-14 8-20 8s-14-2-20-8z" fill="#7fb069"/>',
    eggplant: '<path d="M38 14c-16 0-26 14-26 26 0 10 8 16 18 16 14 0 24-10 24-22 0-10-6-20-16-20z" fill="#5b3b7a"/><path d="M34 10c-4 4-6 10-6 14 6-2 12-2 18 2 0-6-6-14-12-16z" fill="#6f9a6a"/>' + stem(36, 12, 8),
    butternut: '<path d="M26 10h12c4 0 6 4 6 10v8c0 4-2 6-2 10 0 10-6 18-10 18s-10-8-10-18c0-4-2-6-2-10v-8c0-6 2-10 6-10z" fill="#e8b56a"/><path d="M32 12v44" stroke="#d49a4a" stroke-width="2" opacity=".6"/>',
    cabbage: '<circle cx="32" cy="36" r="20" fill="#9bc48d"/><path d="M14 32c6-8 14-10 18-8-6 4-10 10-12 18M50 32c-6-8-14-10-18-8 6 4 10 10 12 18M32 20c-2 10 0 22 6 30" stroke="#5f8f52" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    coconut: '<circle cx="32" cy="36" r="20" fill="#7a5230"/><circle cx="32" cy="36" r="15" fill="#8f6440"/><circle cx="26" cy="30" r="2.5" fill="#4a2e18"/><circle cx="36" cy="28" r="2.5" fill="#4a2e18"/><circle cx="33" cy="36" r="2.5" fill="#4a2e18"/>',
    pineapple: '<path d="M32 8l6 8-6 6-6-6zM24 12l-8 6 8 4zM40 12l8 6-8 4z" fill="#6f9a6a"/><ellipse cx="32" cy="42" rx="14" ry="18" fill="#e5b43c"/><g stroke="#c4952a" stroke-width="1.5">' + [-10, 0, 10, 20].map(function (o) { return '<line x1="' + (16 + o) + '" y1="26" x2="' + (36 + o) + '" y2="58"/><line x1="' + (48 - o) + '" y1="26" x2="' + (28 - o) + '" y2="58"/>'; }).join('') + '</g>',
    melon: function (c1, c2) { return '<circle cx="32" cy="36" r="20" fill="' + c1 + '"/><g stroke="' + c2 + '" stroke-width="1.6" fill="none" opacity=".9"><path d="M22 20c-4 10-4 22 0 32M32 16v40M42 20c4 10 4 22 0 32M14 28c12-3 24-3 36 0M12 36h40M14 44c12 3 24 3 36 0"/></g>'; },
    watermelon: '<circle cx="32" cy="36" r="20" fill="#3f8f4a"/><g stroke="#2a6b33" stroke-width="3" fill="none">' + [-10, 0, 10].map(function (o) { return '<path d="M' + (32 + o) + ' 17c-4 12-4 26 0 38"/>'; }).join('') + '</g><path d="M30 14q2 -6 6 -6" stroke="#6b4b2a" stroke-width="3" fill="none" stroke-linecap="round"/>',
    pumpkin: '<ellipse cx="32" cy="38" rx="22" ry="17" fill="#e8822e"/><ellipse cx="32" cy="38" rx="8" ry="17" fill="#f29a4a"/><path d="M20 24c-2 8-2 20 0 28M44 24c2 8 2 20 0 28" stroke="#c96a20" stroke-width="2" fill="none"/>' + stem(32, 22, 10),
    jackfruit: '<ellipse cx="32" cy="36" rx="18" ry="22" fill="#9aa84a"/><g fill="#7e8c38">' + [[26, 22], [38, 24], [22, 34], [34, 34], [44, 36], [28, 46], [40, 48], [32, 56]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6"/>'; }).join('') + '</g>' + stem(32, 14, 6),
    lettuce: '<ellipse cx="20" cy="38" rx="9" ry="18" fill="#8cc077"/><ellipse cx="44" cy="38" rx="9" ry="18" fill="#8cc077"/><ellipse cx="32" cy="34" rx="11" ry="22" fill="#6aa15a"/><path d="M32 18v36" stroke="#dbe9a8" stroke-width="2.5" stroke-linecap="round" opacity=".9"/><path d="M32 30c-4 2-6 6-6 10M32 30c4 2 6 6 6 10" stroke="#dbe9a8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>',
    jicama: '<circle cx="32" cy="38" r="19" fill="#d8b98a"/><path d="M14 44c6 6 30 6 36 0" stroke="#b8956a" stroke-width="2" fill="none" opacity=".6"/><path d="M26 22c2-4 10-4 12 0" stroke="#b8956a" stroke-width="2" fill="none"/>' + stem(32, 20, 8),
    chard: '<path d="M30 58V26" stroke="#d6454d" stroke-width="5" stroke-linecap="round"/><path d="M30 30c-14-2-22-12-20-22 10 2 18 10 20 22zM30 30c14-2 22-12 20-22-10 2-18 10-20 22zM30 40c-10 0-18-6-20-16 8 2 16 8 20 16zM30 40c10 0 18-6 20-16-8 2-16 8-20 16z" fill="#4e8a3e"/>',
    leek: '<rect x="27" y="30" width="10" height="28" rx="2" fill="#f1ecdf"/><path d="M27 32c-10-6-14-16-14-26 8 4 14 12 14 26zM37 32c10-6 14-16 14-26-8 4-14 12-14 26zM32 30c-4-10-2-18 0-24 2 6 4 14 0 24z" fill="#6aa15a"/>',
    grapefruit: '<circle cx="32" cy="34" r="20" fill="#f6b48c"/><circle cx="32" cy="34" r="15" fill="#ef7f74"/><g stroke="#f6b48c" stroke-width="2">' + [0, 45, 90, 135].map(function (a) { return '<line x1="17" y1="34" x2="47" y2="34" transform="rotate(' + a + ' 32 34)"/>'; }).join('') + '</g>',
    pear: '<path d="M32 16c-4 0-6 4-7 9-1 6-9 10-9 19a16 16 0 0 0 32 0c0-9-8-13-9-19-1-5-3-9-7-9z" fill="#b7c56b"/>' + stem(32, 16, 8) + leaf(33, 10, 5)
  };
  var WEEK_ART = { 4: "seed", 5: "sesame", 6: "lentil", 7: "blueberry", 8: "raspberry", 9: "cherry", 10: "strawberry", 11: "fig", 12: ["citrus", "#8fbf4d", "#d9ef9a"], 13: "peapod", 14: "peach", 15: "apple", 16: "avocado", 17: "pear", 18: "pepper", 19: "mango", 20: "banana", 21: "carrot", 22: ["citrus", "#f2a65a", "#ffd79a"], 23: "grapefruit", 24: "corn", 25: "rutabaga", 26: "zucchini", 27: "cauliflower", 28: "eggplant", 29: "butternut", 30: "cabbage", 31: "coconut", 32: "jicama", 33: "pineapple", 34: ["melon", "#e8c48a", "#c9a46a"], 35: ["melon", "#c9e3a1", "#a7c982"], 36: "lettuce", 37: "chard", 38: "leek", 39: "watermelon", 40: "pumpkin", 41: "jackfruit", 42: "jackfruit" };
  BUMP.sizeArt = function (week) {
    var w = Math.max(4, Math.min(42, week)), spec = WEEK_ART[w], body;
    if (Array.isArray(spec)) body = ART[spec[0]](spec[1], spec[2]); else body = typeof ART[spec] === "function" ? ART[spec]() : ART[spec];
    return '<svg class="art" viewBox="0 0 64 64" aria-hidden="true">' + body + '</svg>';
  };
})();
