import * as React from 'react';
import {
    DiagramEngine,
    PortWidget,
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
        const inputPortList: JSX.Element[] = [];
        const outputPortList: JSX.Element[] = [];
        for (const i of Object.entries(this.props.node.getPorts())) {
            const portModel = i[1];
            const portList = portModel.getName().startsWith('in_') ? inputPortList : outputPortList;
            portList.push(
                <PortWidget engine={this.props.engine} port={portModel} key={portModel.getID()}>
                    <div className="circle-port" />
                </PortWidget>
            );

        }
        return (
            <div className="procedure-node">
                <div className="procedure-node-inputs">
                    {inputPortList}
                </div>
                <div className="procedure-node-outputs">
                    {outputPortList}
                </div>
                <div className="procedure-node-color" style={{ backgroundColor: this.props.node.color }} />
            </div>
        );
    }
}