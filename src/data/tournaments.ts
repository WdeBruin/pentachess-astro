export interface CalendarEvent {
  badge: string;
  badgeColor: 'green' | 'blue' | 'orange' | 'pink' | 'purple';
  dateLabel: string;
  title: string;
  location?: string;
  href: string;
  ctaLabel: string;
  isExternal?: boolean;
}

export interface TeamStanding {
  rank: number;
  team: string;
  played: number;
  matchPoints: number;
  boardPoints: string;
}

export const calendarEvents2026_2027: CalendarEvent[] = [
  {
    badge: 'Gorinchem',
    badgeColor: 'green',
    dateLabel: '25 Okt 2026',
    title: 'ONJK Snelschaak Gorinchem',
    location: 'Gorinchem',
    href: '/nieuws/onjk-snelschaak-25-oktober-gorinchem/',
    ctaLabel: 'Bekijk details',
  },
  {
    badge: 'Meerkerk',
    badgeColor: 'pink',
    dateLabel: '11 Dec 2026',
    title: 'Regiocompetitie Viertallen – Ronde 1 Meerkerk',
    location: 'Dorpshuis De Linde, Meerkerk',
    href: '/nieuws/aankondiging-regiocompetitie-2026-2027/',
    ctaLabel: 'Bekijk details',
  },
  {
    badge: 'Sliedrecht',
    badgeColor: 'blue',
    dateLabel: '15 Jan 2027',
    title: 'Regiocompetitie Viertallen – Ronde 2 Sliedrecht',
    location: 'Activiteitencentrum De Havik, Sliedrecht',
    href: '/nieuws/aankondiging-regiocompetitie-2026-2027/',
    ctaLabel: 'Bekijk details',
  },
  {
    badge: 'Gorinchem',
    badgeColor: 'green',
    dateLabel: '19 Feb 2027',
    title: 'Regiocompetitie Viertallen – Ronde 3 Gorinchem',
    location: 'Fortes Lyceum, Gorinchem',
    href: '/nieuws/aankondiging-regiocompetitie-2026-2027/',
    ctaLabel: 'Bekijk details',
  },
  {
    badge: 'Meerkerk',
    badgeColor: 'orange',
    dateLabel: '11 Apr 2027',
    title: 'Grand Prix Jeugdtoernooi Meerkerk (GP)',
    location: 'Meerkerk',
    href: '/nieuws/aankondiging-regiocompetitie-2026-2027/',
    ctaLabel: 'Bekijk details',
  },
  {
    badge: 'Papendrecht',
    badgeColor: 'purple',
    dateLabel: '16 Apr 2027',
    title: 'Regiocompetitie Viertallen – Ronde 4 Papendrecht',
    location: 'Denksportcentrum, Papendrecht',
    href: '/nieuws/aankondiging-regiocompetitie-2026-2027/',
    ctaLabel: 'Bekijk details',
  },
  {
    badge: 'Dordrecht',
    badgeColor: 'blue',
    dateLabel: '28 Mei 2027',
    title: 'Regiocompetitie Viertallen – Slotronde Dordrecht',
    location: 'Johann de Witt Gymnasium, Dordrecht',
    href: '/nieuws/aankondiging-regiocompetitie-2026-2027/',
    ctaLabel: 'Bekijk details',
  },
  {
    badge: 'Online',
    badgeColor: 'green',
    dateLabel: '1e Woensdag',
    title: 'Maandelijks Online Pentachess Toernooi (19:00 - 20:10 u)',
    location: 'Lichess – Team Pentachess',
    href: 'https://lichess.org/team/pentachess',
    ctaLabel: 'Naar Lichess',
    isExternal: true,
  },
];

export const calendarEvents2025_2026: CalendarEvent[] = [
  {
    badge: 'Sliedrecht',
    badgeColor: 'blue',
    dateLabel: '12 Dec 2025',
    title: 'Regiocompetitie Viertallen – Ronde 1 Sliedrecht',
    href: '/nieuws/uitslagen-viertallentoernooi-sliedrecht-12-december-2025/',
    ctaLabel: 'Uitslagen',
  },
  {
    badge: 'Dordrecht',
    badgeColor: 'orange',
    dateLabel: '13 Feb 2026',
    title: 'Regiocompetitie Viertallen – Ronde 2 Dordrecht',
    href: '/nieuws/uitslagen-viertallentoernooi-dordrecht-13-februari-2026/',
    ctaLabel: 'Uitslagen',
  },
  {
    badge: 'Meerkerk',
    badgeColor: 'pink',
    dateLabel: '20 Mrt 2026',
    title: 'Regiocompetitie Viertallen – Ronde 3 Meerkerk',
    href: '/nieuws/activiteiten-kalender-pentachess-2025-2026/',
    ctaLabel: 'Verslag',
  },
  {
    badge: 'Gorinchem',
    badgeColor: 'purple',
    dateLabel: '17 Apr 2026',
    title: 'Regiocompetitie Viertallen – Ronde 4 Gorinchem',
    href: '/nieuws/activiteiten-kalender-pentachess-2025-2026/',
    ctaLabel: 'Verslag',
  },
  {
    badge: 'Papendrecht',
    badgeColor: 'green',
    dateLabel: '8 Mei 2026',
    title: 'Regiocompetitie Viertallen – Slotronde Papendrecht',
    href: '/nieuws/pentachess-viertallencompetitie-2025-2026-einduitslagen/',
    ctaLabel: 'Einduitslagen',
  },
];

// Default export for backwards compatibility
export const calendarEvents = calendarEvents2026_2027;

export const viertallenStandings: TeamStanding[] = [
  { rank: 1, team: 'Giessen en Linge 1', played: 15, matchPoints: 36, boardPoints: '43,5' },
  { rank: 2, team: 'Sliedrecht 1', played: 15, matchPoints: 34, boardPoints: '46,0' },
  { rank: 3, team: 'Giessen en Linge 2', played: 15, matchPoints: 24, boardPoints: '33,0' },
  { rank: 4, team: 'Dordrecht 1', played: 11, matchPoints: 22, boardPoints: '25,5' },
  { rank: 5, team: 'Giessen en Linge 3', played: 14, matchPoints: 21, boardPoints: '28,0' },
  { rank: 6, team: 'PASCAL 1', played: 14, matchPoints: 19, boardPoints: '23,5' },
  { rank: 7, team: 'Sliedrecht 2', played: 14, matchPoints: 18, boardPoints: '22,0' },
  { rank: 8, team: 'Dordrecht 2', played: 8, matchPoints: 14, boardPoints: '14,0' },
  { rank: 9, team: 'Giessen en Linge 6', played: 8, matchPoints: 13, boardPoints: '15,0' },
  { rank: 10, team: 'Giessen en Linge 5', played: 14, matchPoints: 12, boardPoints: '16,5' },
];
