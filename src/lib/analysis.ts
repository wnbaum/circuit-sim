import { ComponentType, type Component } from "./types"
import { NDArray, array, set, zeros } from 'vectorious'; // in node modules, vectorious. "types": "./dist/index.d.ts" under exports

export interface Edge {
	node: string;
	component: Component;
}

export class CircuitGraph {
	private adj: Map<string, Edge[]>

	private voltages: Set<string>;

	constructor() {
		this.adj = new Map<string, Edge[]>();
		this.voltages = new Set<string>();
		this.resistors = new Set<string>();
	}

	addEdge(nodeA: string, nodeB: string, component: Component): void {
		if (!this.adj.has(nodeA)) {
			this.adj.set(nodeA, []);
		}

		let edge: Edge = { node: nodeB, component: component }
		let val = this.adj.get(nodeA);
		if (val) val.push(edge);

		let hash: string = [nodeA, nodeB].sort().join(",");
		if (component.type == ComponentType.Voltage) {
			this.voltages.add(hash);
		}
	}

	computeMatrix(): void {
		let n: number = this.adj.size; // nodes
		let m: number = this.voltages.size; // voltage sources
		
		// console.log(n,m)

		let A: NDArray = zeros(n+m, n+m);

		// G matrix diagonals // https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA3.html

		let indexes: Map<string, number> = new Map<string, number>();
		let i: number = 0;
		console.log(this.adj.size)
		this.adj.forEach((edges, node) => {
			indexes.set(node, i);
			i++;
		});

		this.adj.forEach((edges, node) => {
			let conductance: number = 0;
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Resistor) {
					conductance += edge.component.data.resistance;

					let from = indexes.get(node)!;
					let to = indexes.get(edge.node)!;

					set(A, from, to, -1/edge.component.data.resistance);
				}
			})
			conductance = 1/conductance;
			let index = indexes.get(node)!;
			set(A, index, index, conductance);
			i++;
		});

		console.log(A.toString())
	}

	size(): number {
		return this.adj.size;
	}
}