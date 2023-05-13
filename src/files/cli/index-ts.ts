import { Archetype, Settings } from '../../types.js';

export function getIndexTsContent(settings: Settings): string {
	return `#! /usr/bin/env node

import { intro, outro } from '@clack/prompts';
import kleur from 'kleur';

intro(kleur.blue().bold('@${settings.client}/${Archetype.cli}'));
// Do stuff
outro("You're all set!");
`;
}
