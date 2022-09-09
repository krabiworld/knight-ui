/**
 * @name vite
 * @function
 * @description - The method returns the values of the variable from the .env.
 * @param {string} variable - Variable name from .env without the prefix 'VITE_'.
 * @return {undefined|any}
 */
export function getEnv(variable) {
	if (!variable && typeof variable !== 'string') return undefined;

	const prefix = 'VITE_';

	if (variable.includes(prefix)) {
		variable = variable.replace(prefix, '');
	}

	try {
		const value = import.meta.env[`${prefix}${variable}`];
		if (value) return value;
	} catch (e) {
		console.error(e);
	}

	return undefined;
}
