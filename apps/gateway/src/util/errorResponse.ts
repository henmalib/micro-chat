export enum ErrorCodes {
	WRONG_PASS_EMAIL = 0,
}

const messages: {
	[key in ErrorCodes]: string;
} = {
	[ErrorCodes.WRONG_PASS_EMAIL]: 'Wrong password or email was given',
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
