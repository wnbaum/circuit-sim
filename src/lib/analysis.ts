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

	private nodeIndexes!: Map<string, number>; // initialized in initGraph
	private voltageIndexes!: Map<string, number>;
	
	private startTime!: number;
	private time!: number; // initialized in initGraph

	constructor() {
		this.adj = new Map<string, Edge[]>();
		this.voltages = new Set<string>();

	}

	getTime(): number {
		return this.time;
	}

	addEdge(nodeA: string, nodeB: string, component: Component, forwards: boolean): void {
		if (!this.adj.has(nodeA)) {
			this.adj.set(nodeA, []);
		}

		let edge: Edge = { node: nodeB, component: component, forwards: forwards }
		let val = this.adj.get(nodeA);
		if (val) val.push(edge);
	}

	hashVoltage(nodeA: string, nodeB: string): string {
		return [nodeA, nodeB].sort().join(",");
	}

	exploreWireHelper(node: string, visited: Set<string>, ret: Set<string>): void {
		if (visited.has(node)) return;
		visited.add(node);
		ret.add(node);
		this.adj.get(node)!.forEach(edge => {
			if (!visited.has(edge.node) && edge.component.type == ComponentType.Wire) {
				this.exploreWireHelper(edge.node, visited, ret);
			}
		});
	}

	initGraph(): void {
		// dissolve wires
		let visited: Set<string> = new Set<string>();
		let connectedGroups: Set<string>[] = []
		this.adj.forEach((edges, node) => {
			let ret: Set<string> = new Set<string>();
			this.exploreWireHelper(node, visited, ret);
			if (ret.size > 1) {
				connectedGroups.push(ret);
			}
		});

		// for each connected group, choose a node to merge to
		// everything not in this group that points to a node in the group must now point to this node
		// every outward connection from a node in the group to outside the group must be the merge nodes edges
		// delete not merged nodes in group
		
		connectedGroups.forEach(group => {
			let mergeNode: string = group.values().next().value;
			this.adj.forEach((edges, node) => {
				if (!group.has(node)) {
					edges.forEach(edge => {
						if (group.has(edge.node)) {
							edge.node = mergeNode;
						}
					});
				}
			});
			let newEdges: Edge[] = [];
			group.forEach(node => {
				this.adj.get(node)!.forEach(edge => {
					if (!group.has(edge.node)) {
						newEdges.push(edge)
					}
				});
			});
			this.adj.set(mergeNode, newEdges);
			group.forEach(node => {
				if (node != mergeNode) {
					this.adj.delete(node);
				}
			});
		});
		
		// console.log(this.adj)

		// find all voltage sources with new matrix
		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				if ((edge.component.type == ComponentType.Voltage || edge.component.type == ComponentType.Capacitor) && edge.forwards) { // capacitors are basically dynamic voltage sources
					let hash: string = this.hashVoltage(node, edge.node);
					this.voltages.add(hash);
				}
			})
		})

		this.nodeIndexes = new Map<string, number>();
		let i: number = 0;
		this.adj.forEach((edges, node) => {
			this.nodeIndexes.set(node, i);
			i++;
		});

		this.voltageIndexes = new Map<string, number>();
		i = 0;
		this.voltages.forEach(hash => {
			this.voltageIndexes.set(hash, i);
			i++;
		});

		this.startTime = Date.now();
		this.time = 0;
	}

	tick(): void {
		let deltaT: number = ((Date.now()-this.startTime) - this.time)/1000.0; // seconds
		this.time = (Date.now()-this.startTime)/1000.0;

		// compute matrix
		let n: number = this.adj.size; // nodes
		let m: number = this.voltages.size; // voltage sources
		
		// console.log(n,m)

		let A: NDArray = zeros(n+m, n+m);

		// G matrix diagonals // https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA3.html

		this.adj.forEach((edges, node) => {
			let conductance: number = 0;
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Resistor) {
					conductance += 1/edge.component.data.resistance;

					let from = this.nodeIndexes.get(node)!;
					let to = this.nodeIndexes.get(edge.node)!;

					set(A, from, to, -1/edge.component.data.resistance);
				}
			})
			let index = this.nodeIndexes.get(node)!;
			set(A, index, index, conductance);
		});

		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Voltage || edge.component.type == ComponentType.Capacitor) {
					let index: number = this.voltageIndexes.get(this.hashVoltage(node, edge.node))!;

					set(A, this.nodeIndexes.get(node)!, n+index, edge.forwards ? -1 : 1); // if voltage is forwards, we are connected to negative
					set(A, n+index, this.nodeIndexes.get(node)!, edge.forwards ? -1 : 1); // transpose of B matrix
				}
			})
		});

		// A should be created. D is a matrix of zeros
		// console.log(A.toString())

		// solve for X matrix, need Z

		let Z: NDArray = zeros(n+m, 1);
		// ignore current sources for now

		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				if ((edge.component.type == ComponentType.Voltage || edge.component.type == ComponentType.Capacitor) && edge.forwards) { // find voltage sources
					let index: number = this.voltageIndexes.get(this.hashVoltage(node, edge.node))!;
					set(Z, n+index, 0, edge.component.data.voltage);
				}
				if (edge.component.type == ComponentType.CurrentSource) { // find current sources
					let index: number = this.nodeIndexes.get(edge.node)!;
					set(Z, index, 0, edge.component.data.current * (edge.forwards ? 1 : -1));
				}
			})
		});

		// Z should be created
		// console.log(Z.toString())

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

		// console.log(Ag.toString())
		// console.log(Zg.toString())

		let X: NDArray = Ag.solve(Zg);

		// first n-1 entries are solved voltages at each node (excluding ground which is 0), last m entries are solved currents through each voltages source

		console.log(X.toString());

		// now compute changes in dynamic components
		
		// capacitors dV/dt = I/C
		let voltageHashes: string[] = Array.from(this.voltages);
		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Capacitor && edge.forwards) { // capacitors are basically dynamic voltage sources
					let index: number = this.voltageIndexes.get(this.hashVoltage(node, edge.node))!;
					let currentOverVoltageSource: number = X.get((n-1)+index, 0); // get current. n-1 because we have ground node row removed at this point
					if (edge.component.type == ComponentType.Capacitor) {
						edge.component.data.voltage += (currentOverVoltageSource/edge.component.data.capacitance)*deltaT;
					}
				}
			})
		})

		// compute voltmeter voltages
		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Voltmeter && edge.forwards) {
					let aIndex: number = this.nodeIndexes.get(node)!;
					let bIndex: number = this.nodeIndexes.get(edge.node)!;
					let aVoltage: number = 0;
					let bVoltage: number = 0;
					if (aIndex > 0) {
						aVoltage = X.get(aIndex-1, 0);
					}
					if (bIndex > 0) {
						bVoltage = X.get(bIndex-1, 0);
					}
					edge.component.data.voltage = bVoltage - aVoltage;
				}
			})
		})
	}

	reset(): void {
		this.startTime = Date.now();
		this.time = 0;
		this.adj.forEach((edges, node) => {
			edges.forEach(edge => {
				if (edge.component.type == ComponentType.Capacitor && edge.forwards) {
					edge.component.data.voltage = 0;
				}
			})
		})
	}

	size(): number {
		return this.adj.size;
	}
}