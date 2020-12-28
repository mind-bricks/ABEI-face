import React from 'react';
import {
    PortWidget,
    DiagramEngine,
} from '@projectstorm/react-diagrams-core';
import {
    createStyles,
    makeStyles,
    Box,
    Theme,
    Typography,
} from '@material-ui/core';
import { LabelSharp } from '@material-ui/icons';
import { IDiagramNode } from '..';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        procedure: {
            border: 'solid 3px',
            borderColor: theme.palette.secondary.main,
            borderRadius: '5px',
            minWidth: '50px',
            minHeight: '50px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative',
            opacity: 0.8,
            flexGrow: 1,
            flexDirection: 'column',
            '&:hover': {
                opacity: 1.0,
            }
        },

        procedureTitle: {
            backgroundColor: theme.palette.primary.main,
            width: '100%',
        },

        procedureTitleText: {
            marginTop: '2px',
            marginBottom: '2px',
            marginLeft: '20px',
            marginRight: '20px',
            textAlign: 'center',
        },

        procedureBody: {
            backgroundColor: theme.palette.primary.light,
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative',
        },

        procedureHub: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
        },

        procedurePort: {
            display: 'flex',
            // marginTop: '2px',
            alignItems: 'center',
        },

        procedurePortText: {
            flexGrow: 1,
            padding: '0px 5px',
            textAlign: 'center',
        },

        procedurePortLink: {
            minWidth: '26px',
            minHeight: '26px',
            // marginTop: '3px',
            // color: theme.palette.primary.light,
            cursor: 'pointer',
        },

        procedurePortLinkIcon: {
            color: theme.palette.primary.main,
            '&:hover': {
                color: theme.palette.secondary.main,
            }
        }

    }),
);

interface IDiagramWidgetProps {
    engine: DiagramEngine;
    node: IDiagramNode;
}

export const DiagramNodeWidget = (props: IDiagramWidgetProps) => {
    const classes = useStyles();

    return (
        <Box className={classes.procedure}>
            <div className={classes.procedureTitle}>
                <Typography className={classes.procedureTitleText}>
                    {props.node.getSignature()}
                </Typography>
            </div>
            <div className={classes.procedureBody}>
                <div className={classes.procedureHub}>
                    {[...props.node.getInputList().values()].map((port) => (
                        <div className={classes.procedurePort} key={port.getKey()}>
                            <PortWidget
                                className={classes.procedurePortLink}
                                engine={props.engine}
                                port={port.getImplement()}
                            >
                                <LabelSharp className={classes.procedurePortLinkIcon} />
                            </PortWidget>
                            <Typography className={classes.procedurePortText}>
                                {port.getSignature()}
                            </Typography>
                        </div>
                    ))}
                </div>
                <div className={classes.procedureHub}>
                    {[...props.node.getOutputList().values()].map((port) => (
                        <div className={classes.procedurePort} key={port.getKey()}>
                            <Typography className={classes.procedurePortText}>
                                {port.getSignature()}
                            </Typography>
                            <PortWidget
                                className={classes.procedurePortLink}
                                engine={props.engine}
                                port={port.getImplement()}
                            >
                                <LabelSharp className={classes.procedurePortLinkIcon} />
                            </PortWidget>
                        </div>
                    ))}
                </div>
            </div>
        </Box>
    );
}
