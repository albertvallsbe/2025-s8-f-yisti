export type ItemCard = {
	id: number;
	title: string;
	description: string;
	price: number;
};

export type NavigationControls = {
	checked: boolean;
	onToggle: (id: number, checked: boolean) => void;
};

export type WebOptionsProps = {
	webPagesCounter: UseCounterResult;
	webLanguagesCounter: UseCounterResult;
};

export type UseCounterOptions = {
	initialValue: number;
	minimumValue: number;
	maximumValue?: number;
};

export type UseCounterResult = {
	value: number;
	increment: () => void;
	decrement: () => void;
	canIncrement: boolean;
	canDecrement: boolean;
};

export type CardProps = {
	card: ItemCard;
	controls?: NavigationControls;
	webOptionsProps?: WebOptionsProps;
};

export type BudgetServiceItem = {
	id: string;
	name: string;
	price: number;
};

export type SummaryData = {
	selectedServices: BudgetServiceItem[];
	pages: number;
	languages: number;
	total: number;
	totalItems: number;
};

export type BudgetFormProps = {
	onAddBudget: (data: {
		clientName: string;
		clientMail: string;
		clientPhone: string;
	}) => void;
};

export type Budget = {
	id: string;
	clientName: string;
	clientMail: string;
	clientPhone: string;
	selectedServices: BudgetServiceItem[];
	pages?: number;
	languages?: number;
	total: number;
	totalItems: number;
	date: string;
};
