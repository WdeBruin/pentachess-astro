import fs from 'node:fs';

// Check Homepage
const home = fs.readFileSync('dist/index.html', 'utf-8');
console.log('Homepage checks:');
console.log('- Has logo:', home.includes('pentachess_logo.png'));
console.log('- Has 4 nav items:', home.includes('/info/') && home.includes('/nieuws/') && home.includes('/schoolschaak/'));
console.log('- Schoolschaakcongres NOT in nav:', !home.includes('id="menu-item-452"'));
console.log('- Has HeroSlider:', home.includes('hero-slider-track') && home.includes('slide1.jpg'));
console.log('- Has Laatste nieuws:', home.includes('Laatste nieuws'));
console.log('- Has Liam Vrolijk image:', home.includes('/wp-content/uploads/2020/04/liamvrolijk.png'));
console.log('- Has Anne Haast image:', home.includes('/wp-content/uploads/2020/04/haast.png'));

// Check Info
const info = fs.readFileSync('dist/info/index.html', 'utf-8');
console.log('\nInfo checks:');
console.log('- Has Google Maps iframe:', info.includes('https://www.google.com/maps/d/u/0/embed'));
console.log('- Has club logos:', info.includes('clubsliedrecht.png') && info.includes('clubpascal.png'));

// Check Schoolschaak
const schoolschaak = fs.readFileSync('dist/schoolschaak/index.html', 'utf-8');
console.log('\nSchoolschaak checks:');
console.log('- Has YouTube embed:', schoolschaak.includes('https://www.youtube.com/embed/oaEyEfAZUNQ'));
console.log('- Has 16:9 wrapper:', schoolschaak.includes('wp-embed-aspect-16-9'));

// Check Post 425
const post425 = fs.readFileSync('dist/nieuws/aankondiging-schoolschaak-congres-woensdag-28-oktober-2026-driebergen-basisscholen-aan-zet/index.html', 'utf-8');
console.log('\nPost 425 checks:');
console.log('- Has postponement notice:', post425.includes('Let op: Dit evenement (Schoolschaakcongres 28 oktober 2026) is uitgesteld naar een nader te bepalen datum.'));

// Check Post 436 Single
const post436 = fs.readFileSync('dist/nieuws/onjk-snelschaak-25-oktober-gorinchem/index.html', 'utf-8');
console.log('\nPost 436 checks:');
console.log('- Has pagination nav:', post436.includes('class="pagination-single'));
console.log('- Author mapped:', post436.includes('/author/admin/'));
console.log('- Dutch date:', post436.includes('4 september 2026'));

// Check Nieuws pagination
const nieuwsPage2 = fs.readFileSync('dist/nieuws/page/2/index.html', 'utf-8');
console.log('\nNieuws page 2 checks:');
console.log('- Has pagination links:', nieuwsPage2.includes('/nieuws/page/3/'));
console.log('- Has prev link to /nieuws/:', nieuwsPage2.includes('href="/nieuws/"'));
