import * as React from 'react';
import {
    DiagramEngine,
    PortWidget,
} from '@projectstorm/react-diagrams-core';
import { ProcedureModel } from './Model';

interface IProcedureWidgetProps {
    model: ProcedureModel;
    engine: DiagramEngine;
}

export function ProcedureWidget(props: IProcedureWidgetProps) {
    const inputPortList: JSX.Element[] = [];
    const outputPortList: JSX.Element[] = [];
    for (const i of Object.entries(props.model.getPorts())) {
        const portModel = i[1];
        const portID = portModel.getID();
        const portName = portModel.getName();
        const portIsInput = portName.startsWith('in_');
        if (portIsInput) {
            inputPortList.push(
                <div className='port' key={portID}>
                    <PortWidget
                        engine={props.engine}
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
                        engine={props.engine}
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
            <div className='title'>{props.model.signature}</div>
            <div className='body'>
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
