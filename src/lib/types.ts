export enum ComponentType {
	Voltage,
	Resistor,
	Capacitor
}

export interface Component {
	name: string;
	type: ComponentType;
	data: any;
}