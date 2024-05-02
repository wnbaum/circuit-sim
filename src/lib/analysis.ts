import { ComponentType, type Component } from "./types"
import { NDArray, array, set, zeros } from 'vectorious'; // in node modules, vectorious. "types": "./dist/index.d.ts" under exports

export interface Edge {
	node: string;
	component: Component;
	forwards: boolean;
}

export class CircuitGraph {
	private adj: Map<string, Edge[]>

	private voltages: Set<string>;

	constructor() {
		this.adj = new Map<string, Edge[]>();
		this.voltages = new Set<string>();
	}

	addEdge(nodeA: string, nodeB: string, component: Component, forwards: boolean): void {
		if (!this.adj.has(nodeA)) {
			this.adj.set(nodeA, []);
		}

		let edge: Edge = { node: nodeB, component: component, forwards: forwards }
		let val = this.adj.get(nodeA);
		if (val) val.push(edge);
	}

	hashEdge(nodeA: string, nodeB: string): string {
		return [nodeA, nodeB].sort().join(",");
	}

	exploreWireHelper(node: string, visited: Set<string>, ret: string[]): void {
		if (visited.has(node)) return;
		visited.add(node);
		ret.push(node);
		this.adj.get(node)!.forEach(edge => {
			if (!visited.has(edge.node) && edge.component.type == ComponentType.Wire) {
				this.exploreWireHelper(edge.node, visited, ret);
			}
		});
	}

	computeMatrix(): void {
		// dissolve wires
		let visited: Set<string> = new Set<string>();
		let connectedGroups: string[][] = []
		this.adj.forEach((edges, node) => {
			let ret: string[] = [];
			this.exploreWireHelper(node, visited, ret);
			if (ret.length > 1) {
				connectedGroups.push(ret);
			}
		});

		connectedGroups.forEach(group => {
			let combinedNode: string = group[0];
			let groupSet: Set<string> = new Set(group);
			let deletion: string[] = [];
			this.adj.forEach((edges, node) => {
				// add every combined connection to last node
				if (groupSet.has(node)) {
					deletion.push(node);
					let lastEdges: Edge[] = this.adj.get(combinedNode)!;
					lastEdges = lastEdges.concat(edges)
				}
				// if another node pointing to a node in group, point it to last node
				edges.forEach(edge => {
					if (groupSet.has(edge.node)) {
						edge.node = combinedNode;
					}
				})
			})
			deletion.forEach(node => {
				if (node != combinedNode) this.adj.delete(node);
			})
		})

		this.adj.forEach((edges, node) => {
			let newEdges: Edge[] = [];
			let nodes: Set<string> = new Set<string>();
			edges.forEach(edge => {
				if (!nodes.has(edge.node) && edge.node != node) {
					newEdges.push(edge);
				}
				nodes.add(edge.node);
			})
			this.adj.set(node, newEdges);
		})

		console.log(this.adj)

		// find all voltage sources with new matrix
		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				let hash: string = this.hashEdge(node, edge.node);
				if (edge.component.type == ComponentType.Voltage) {
					this.voltages.add(hash);
				}
			})
		})

		// compute matrix
		let n: number = this.adj.size; // nodes
		let m: number = this.voltages.size; // voltage sources
		
		// console.log(n,m)

		let A: NDArray = zeros(n+m, n+m);

		// G matrix diagonals // https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA3.html

		let nodeIndexes: Map<string, number> = new Map<string, number>();
		let i: number = 0;

		this.adj.forEach((edges, node) => {
			nodeIndexes.set(node, i);
			i++;
		});

		let voltageIndexes: Map<string, number> = new Map<string, number>();
		i = 0;
		this.voltages.forEach(hash => {
			voltageIndexes.set(hash, i);
			i++;
		});

		this.adj.forEach((edges, node) => {
			let conductance: number = 0;
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Resistor) {
					conductance += 1/edge.component.data.resistance;

					let from = nodeIndexes.get(node)!;
					let to = nodeIndexes.get(edge.node)!;

					set(A, from, to, -1/edge.component.data.resistance);
				}
			})
			let index = nodeIndexes.get(node)!;
			set(A, index, index, conductance);
			i++;
		});

		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Voltage) {
					let index: number = voltageIndexes.get(this.hashEdge(node, edge.node))!;

					set(A, nodeIndexes.get(node)!, n+index, edge.forwards ? -1 : 1); // if voltage is forwards, we are connected to negative
					set(A, n+index, nodeIndexes.get(node)!, edge.forwards ? -1 : 1); // transpose of B matrix
				}
			})
			i++;
		});

		// A should be created. D is a matrix of zeros
		console.log(A.toString())

		// solve for X matrix, need Z

		let Z: NDArray = zeros(n+m, 1);
		// ignore current sources for now

		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Voltage && edge.forwards) { // find voltage sources
					let index: number = voltageIndexes.get(this.hashEdge(node, edge.node))!;
					set(Z, n+index, 0, edge.component.data.voltage);
				}
			})
		});

		// Z should be created
		console.log(Z.toString())

		// pick a node as ground (first node)
		let Ag: NDArray = zeros(n+m-1,n+m-1);
		for (let i = 1; i < n+m; i++) {
			for (let j = 1; j < n+m; j++) {
				set(Ag, i-1, j-1, A.get(i, j));
			}
		}
		let Zg: NDArray = zeros(n+m-1,1);
		for (let i = 1; i < n+m; i++) {
			set(Zg, i-1, 0, Z.get(i, 0))
		}

		console.log(Ag.toString())
		console.log(Zg.toString())

		let X: NDArray = Ag.solve(Zg);

		// first n-1 entries are solved voltages at each node (excluding ground which is 0), last m entries are solved currents through each voltages source

		console.log(X.toString());


	}

	size(): number {
		return this.adj.size;
	}
}