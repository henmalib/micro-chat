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

const fs = require('node:fs');
const path = require('node:path');

const header = `/**
 * Copyright (C) ${new Date().getFullYear()}  henmalib
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
 */`;

const targetExtensions = ['.ts', '.js'];
const ignoreDir = ['node_modules', '.docker', '.git', 'dist', 'drizzle'];
const projectRoot = path.resolve(__dirname, '..');

/**
 *
 * @param {string} content
 * @returns {boolean}
 */
function hasHeader(content) {
	const h = header.replace(/\d{4}/, '[year]');

	return content.replace(/\d{4}/, '[year]').startsWith(h);
}

/**
 *
 * @param {string} filePath
 */
function addHeaderIfNeeded(filePath) {
	const content = fs.readFileSync(filePath, 'utf8');
	if (hasHeader(content)) return;

	const newContent = `${header}\n\n${content}`;
	fs.writeFileSync(filePath, newContent, 'utf8');
}

/**
 *
 * @param {string} dir
 */
function walk(dir) {
	for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, file.name);
		if (file.isDirectory()) {
			if (ignoreDir.includes(file.name)) continue;
			walk(fullPath);
		} else if (targetExtensions.includes(path.extname(file.name))) {
			addHeaderIfNeeded(fullPath);
		}
	}
}

walk(projectRoot);
