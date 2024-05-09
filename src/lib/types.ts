export enum ComponentType {
	Voltage,
	Alternator,
	Resistor,
	Capacitor,
	Inductor,
	Wire,
	CurrentSource,
	Voltmeter,
}

export interface Component {
	name: string;
	type: ComponentType;
	data: any;
}