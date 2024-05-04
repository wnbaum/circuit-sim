export enum ComponentType {
	Voltage,
	Resistor,
	Capacitor,
	Inductor,
	Wire,
	CurrentSource,
	Voltmeter
}

export interface Component {
	name: string;
	type: ComponentType;
	data: any;
}