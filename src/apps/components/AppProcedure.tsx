import * as React from 'react';
import {
    DiagramEngine,
    PortWidget,
} from '@projectstorm/react-diagrams-core';
import { Procedure } from '../providers/Procedure';

export interface IProcedureProps {
    node: Procedure;
    engine: DiagramEngine;
}

export interface IProcedureState { }

export class AppProcedure extends React.Component<
    IProcedureProps, IProcedureState>
{
    constructor(props: IProcedureProps) {
        super(props);
    }

    render() {
        const inputPortList: JSX.Element[] = [];
        const outputPortList: JSX.Element[] = [];
        for (const i of Object.entries(this.props.node.getPorts())) {
            const portModel = i[1];
            const portID = portModel.getID();
            const portName = portModel.getName();
            const portIsInput = portName.startsWith('in_');
            if (portIsInput) {
                inputPortList.push(
                    <div className='port' key={portID}>
                        <PortWidget
                            engine={this.props.engine}
                            port={portModel}
                        >
                            <div className='link'></div>
                        </PortWidget>
                        <div className='label'>{portName}</div>
                    </div>
                )
            } else {
                outputPortList.push(
                    <div className='port' key={portID}>
                        <div className='label'>{portName}</div>
                        <PortWidget
                            engine={this.props.engine}
                            port={portModel}
                        >
                            <div className='link'></div>
                        </PortWidget>
                    </div>
                )
            }
        }
        return (
            <div className='procedure-node'>
                <div className='title'>{this.props.node.signature}</div>
                <div className='body' style={{ backgroundColor: this.props.node.color }}>
                    <div className='hub'>
                        {inputPortList}
                    </div>
                    <div className='hub' style={{ marginLeft: '20px' }}>
                        {outputPortList}
                    </div>
                </div>
            </ div>
        );
    }
}