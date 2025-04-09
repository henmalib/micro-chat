/**
 * Copyright (C) 2025  henmalib
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { getRandomInt } from '@shared/utils';

const characters = ['qwertyuiopasdfghjklzxcvbnm'];
characters.push(characters[0].toUpperCase());
characters.push(',./p[;\'"1234567890');
const ch = characters.join('');
export const generatePeper = (length = 8) => {
	let result = '';

	for (let i = 0; i < length; i++) {
		result += ch[getRandomInt(0, ch.length - 1)];
	}

	return result;
};
