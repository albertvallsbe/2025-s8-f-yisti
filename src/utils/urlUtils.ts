export type BudgetParams = {
	seo: boolean;
	ads: boolean;
	web: boolean;
	pages: number;
	lang: number;
};

/** Construeix una cadena de paràmetres a partir de l’estat */
export function buildBudgetQuery(params: BudgetParams): string {
	const qp = new URLSearchParams();
	qp.set("CampaignSeo", params.seo.toString());
	qp.set("CampaignAds", params.ads.toString());
	qp.set("WebPage", params.web.toString());
	qp.set("pages", params.pages.toString());
	qp.set("lang", params.lang.toString());
	return qp.toString();
}

/** Parsea location.search i retorna un objecte amb valors tipats */
export function parseBudgetQuery(search: string): BudgetParams {
	const qp = new URLSearchParams(search);
	return {
		seo: qp.get("CampaignSeo") === "true",
		ads: qp.get("CampaignAds") === "true",
		web: qp.get("WebPage") === "true",
		pages: Math.max(1, Number(qp.get("pages")) || 1),
		lang: Math.max(1, Number(qp.get("lang")) || 1),
	};
}
