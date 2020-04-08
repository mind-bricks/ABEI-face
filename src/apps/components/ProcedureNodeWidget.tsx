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
            const portName = portModel.getName();
            const portIsInput = portName.startsWith('in_');
            const portList = portIsInput ? inputPortList : outputPortList;
            const portLinkJSX: JSX.Element =
                <PortWidget engine={this.props.engine} port={portModel}>
                    <div className='link'></div>
                </PortWidget>;
            const portLabelJSX: JSX.Element =
                <div className='label'>{portName}</div>
            const portJSX = portIsInput
                ?
                <div className='port' key={portName}>
                    {portLinkJSX}
                    {portLabelJSX}
                </div>
                :
                <div className='port' key={portName}>
                    {portLabelJSX}
                    {portLinkJSX}
                </div>;
            portList.push(portJSX);

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