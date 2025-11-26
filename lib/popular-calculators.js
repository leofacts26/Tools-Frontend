// Helper to load popular calculators from messages/<locale>/common.json
export async function loadPopularCalculators(locale = "en") {
	async function tryLoad(loc) {
		try {
			const mod = await import(`../messages/${loc}/common.json`);
			const obj = mod && (mod.default || mod);
			return obj?.popularCalculators || null;
		} catch (err) {
			return null;
		}
	}

	const data = await tryLoad(locale);
	if (data) return data;
	// fallback to English
	const fallback = await tryLoad("en");
	return fallback || { title: "Popular Calculators", items: [] };
}
