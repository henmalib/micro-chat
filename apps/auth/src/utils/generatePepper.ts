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
