import type { PageLoad } from './$types';
import { fetchRefresh } from '$helpers';

const SPOTIFY_API = '/api/spotify/'
const LIMIT = 'limit=6'

export const load: PageLoad = async ({ fetch: _fetch, parent }) => {
	const fetch = (path: string) => fetchRefresh(_fetch, path);
	const { user } = await parent();
	const newReleases = fetch(`${SPOTIFY_API}browse/new-releases?${LIMIT}`);
	const featuredPlaylists = fetch(`${SPOTIFY_API}browse/featured-playlists?${LIMIT}`);
	const userPlaylists = fetch(`${SPOTIFY_API}users/${user?.id}/playlists?${LIMIT}`);

	const catsRes = await fetch(`${SPOTIFY_API}browse/categories`);
	const catsResJSON: SpotifyApi.MultipleCategoriesResponse | undefined = catsRes.ok
		? await catsRes.json()
		: undefined;

	const randomCats = catsResJSON
		? catsResJSON.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3)
		: [];

	const randomCatsPromises = randomCats.map((cat) =>
		fetch(`${SPOTIFY_API}browse/categories/${cat.id}/playlists?${LIMIT}`)
	);

	const [newReleasesRes, featuredPlaylistsRes, userPlaylistsRes, ...randomCatsRes] =
		await Promise.all([newReleases, featuredPlaylists, userPlaylists, ...randomCatsPromises]);

	return {
		newReleases: newReleasesRes.ok
			? (newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>)
			: undefined,
		featuredPlaylists: featuredPlaylistsRes.ok
			? (featuredPlaylistsRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
			: undefined,
		userPlaylists: userPlaylistsRes.ok
			? (userPlaylistsRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
			: undefined,
		homeCategories: randomCats,
		categoriesPlaylists: Promise.all(
			randomCatsRes.map((res) =>
				res.ok ? (res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>) : undefined
			)
		)
	};
};
