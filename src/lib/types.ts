export enum ComponentType {
	Voltage,
	Resistor,
	Capacitor,
	Wire
}

export interface Component {
	name: string;
	type: ComponentType;
	data: any;
}