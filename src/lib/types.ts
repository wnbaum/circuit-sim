export enum ComponentType {
	Voltage,
	Resistor,
	Capacitor,
	Wire,
	CurrentSource
}

export interface Component {
	name: string;
	type: ComponentType;
	data: any;
}