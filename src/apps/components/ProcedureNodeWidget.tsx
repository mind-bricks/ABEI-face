import * as React from 'react';
import {
    DiagramEngine,
    PortWidget
} from '@projectstorm/react-diagrams-core';
import { ProcedureNodeModel } from './ProcedureNodeModel';

export interface ProcedureNodeWidgetProps {
    node: ProcedureNodeModel;
    engine: DiagramEngine;
}

export interface ProcedureNodeWidgetState { }

export class ProcedureNodeWidget extends React.Component<ProcedureNodeWidgetProps, ProcedureNodeWidgetState>
{
    constructor(props: ProcedureNodeWidgetProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="procedure-node">
                <PortWidget engine={this.props.engine} port={this.props.node.getPort('in')}>
                    <div className="circle-port" />
                </PortWidget>
                <PortWidget engine={this.props.engine} port={this.props.node.getPort('out')}>
                    <div className="circle-port" />
                </PortWidget>
                <div className="procedure-node-color" style={{ backgroundColor: this.props.node.color }} />
            </div>
        );
    }
}