/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RPLocation {
  housingArea: string; // e.g., "海霧村 (海都)", "薰衣草苗圃 (森都)", "高風大都會 (白銀鄉)", "穹頂/沙都", "群落/心之區", "客房/公寓"
  ward: number;        // 1 - 30
  plot: number;        // 1 - 60 or Room number
  roomNumber?: string; // Optional room or apartment indicator e.g., "公寓 1號房"
}

export type RPCategory = string;

export interface RPEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
  dc: string;         // e.g., "Mana", "Elemental", "Gaia", "Meteor"
  world: string;      // e.g., "Chocobo", "Tonberry", "Fenrir", "Valefor"
  location: RPLocation;
  category: RPCategory;
  host: string;
  dressCode: string;
  description: string;
  tags: string[];
  bannerGradient: string; // Tailwind gradient preset
  discordUrl?: string;
  recruitmentText?: string; // Staff recruitment info if any
  isCustom?: boolean; // User created events
}

export type CalendarView = 'month' | 'week' | 'agenda';

export interface CalendarFilters {
  searchTerm: string;
  datacenter: string;
  category: string;
  onlyCustom: boolean;
}
