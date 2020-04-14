import * as React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

export interface IAppContentProps {
    engine: DiagramEngine;
}

export class AppContent extends React.Component<IAppContentProps>
{
    render() {
        return <CanvasWidget
            className="procedure-panel"
            engine={this.props.engine}
        />;
    }
}
