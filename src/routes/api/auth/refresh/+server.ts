import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	// refresh token that has been previously stored
	const refreshToken = cookies.get('refresh_token');

	const payload = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(
				`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`
			).toString('base64')}`
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken || ''
		})
	};

	const response = await fetch('https://accounts.spotify.com/api/token', payload);
	const responseJSON = await response.json();

	if (responseJSON.error) {
		cookies.delete('refresh_token', { path: '/' });
		cookies.delete('access_token', { path: '/' });

		throw error(401, responseJSON.error_description);
	}

	cookies.set('refresh_token', responseJSON.refresh_token, { path: '/' });
	cookies.set('access_token', responseJSON.access_token, { path: '/' });

	return json(responseJSON);
};
