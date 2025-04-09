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

export enum ErrorCodes {
	WRONG_PASS_EMAIL = 0,
	UNAUTHORIZED = 1,
	NOT_FOUND = 2,
}

const messages: {
	[key in ErrorCodes]: string;
} = {
	[ErrorCodes.WRONG_PASS_EMAIL]: 'Wrong password or email was given',
	[ErrorCodes.UNAUTHORIZED]: 'Provided wrong token',
	[ErrorCodes.NOT_FOUND]: 'Requested object was not found',
} as const;

export type ErrorObject = {
	code: ErrorCodes;
	message: string;
	info?: Record<string, unknown>;
};

export function getErrorObject(
	errorCode: ErrorCodes,
	info?: Record<string, unknown>,
): ErrorObject {
	return {
		code: errorCode,
		message: messages[errorCode],
		info,
	};
}
